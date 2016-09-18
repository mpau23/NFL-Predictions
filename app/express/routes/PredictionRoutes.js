var User = require('../tables/UserTable');
var Game = require('../tables/GameTable');
var Prediction = require('../tables/PredictionTable');
var winston = require('winston');

module.exports = function(app) {

    app.get('/api/get/prediction/for-user/:user/before-date/:date', function(req, res) {

        var date = new Date(req.params.date);

        winston.info("Requesting " + req.params.user + "'s predictions for games that started before " + date);

        date.setHours(date.getHours());

        User.findOne({
            username: req.params.user
        }, function(err, user) {

            if (err || !user) {
                res.send(err);
            } else {

                Game.find({
                    date: {
                        $lte: new Date(date)
                    }
                }, function(err, games) {

                    if (err) {
                        res.send(err);
                    } else {

                        var gameIds = new Array();

                        games.forEach(function(game, index) {
                            gameIds.push(game._id);
                        })

                        Prediction.find({
                                'user': user._id,
                            }, '-_id game awayPrediction homePrediction joker')
                            .where('game').in(gameIds)
                            .exec(function(err, predictions) {

                                if (err) {
                                    res.send(err)
                                } else {
                                    res.json(predictions);
                                }
                            });
                    }
                });
            }

        });

    });


    app.get('/api/get/prediction/for-user/:user/week/:week', function(req, res) {

        winston.info("Requesting week " + req.params.week + " predictions for user " + req.params.user);

        Game.find({
            week: req.params.week
        }, function(err, games) {

            if (err) {
                res.send(err);
            } else {

                var gameIds = new Array();

                games.forEach(function(game, index) {
                    gameIds.push(game._id);
                })

                Prediction.find({
                        'user': req.params.user,
                    }, '-_id game awayPrediction homePrediction joker')
                    .where('game').in(gameIds)
                    .exec(function(err, predictions) {

                        if (err) {
                            res.send(err)
                        } else {
                            res.json(predictions);
                        }
                    });
            }
        });
    });


    app.post('/api/post/prediction', function(req, res) {

        winston.info("Saving user " + req.body.user + "'s prediction for game: " + req.body.game);

        Prediction.findOne({
            game: req.body.game,
            user: req.body.user
        }, function(err, prediction) {

            if (err) {
                res.send(err);
            } else {

                if (prediction) {
                    prediction.homePrediction = req.body.homePrediction;
                    prediction.awayPrediction = req.body.awayPrediction;
                    prediction.joker = req.body.joker;

                    prediction.save(function(err) {
                        if (err) {
                            return res.send(err);
                        } else {
                            return res.send(prediction);
                        }
                    });

                } else {
                    var prediction;

                    prediction = new Prediction({
                        game: req.body.game,
                        user: req.body.user,
                        homePrediction: req.body.homePrediction,
                        awayPrediction: req.body.awayPrediction,
                        joker: req.body.joker
                    });

                    prediction.save(function(err) {
                        if (err) {
                            return res.send(err);
                        } else {
                            return res.send(prediction);
                        }

                    });
                }
            }
        });

    });

}
