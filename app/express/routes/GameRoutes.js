var Game = require('../tables/GameTable');
var Team = require('../tables/TeamTable');
var winston = require('winston');


module.exports = function(app) {

    app.get('/api/get/game/week/:week', function(req, res) {

        winston.info("Requesting games for week " + req.params.week);

        Game.find({
                week: req.params.week
            })
            .populate('awayTeam')
            .populate('homeTeam')
            .exec(function(err, game) {
                if (err) {
                    res.send(err);
                } else {
                    res.json(game);
                }
            });

    });

    app.get('/api/get/game/before-date/:date', function(req, res) {

        var date = new Date(req.params.date);

        winston.info("Requesting games that started before " + date);

        date.setHours(date.getHours() - 5);

        winston.info("ET equivelant date is " + date);

        Game.find({
                date: {
                    $lte: new Date(date)
                }
            })
            .populate('awayTeam')
            .populate('homeTeam')
            .exec(function(err, game) {
                if (err) {
                    res.send(err);
                } else {
                    res.json(game);
                }
            });
    });

    app.post('/api/post/game', function(req, res) {

        winston.info("Saving game " + req.body.game);

        var date = new Date(req.body.date);

        Game.findById(req.body.game, function(err, game) {
            if (err) {
                res.send(err);
            } else {

                if (game) {
                    game.homeScore = req.body.homeScore;
                    game.awayScore = req.body.awayScore;
                    game.date = date;
                    game.save(function(err) {
                        if (err) {
                            return res.send(err);
                        } else {
                            return res.send(game);
                        }
                    });

                } else {
                    var err = "Invalid game";
                    res.send(err);
                }
            }
        });

    });
}
