var Game = require('../tables/GameTable');
var Team = require('../tables/TeamTable');
var winston = require('winston');
var request = require('request');
var cheerio = require('cheerio');

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

    app.get('/api/import/game/week/:week', function(req, res) {

        var week = req.params.week;

        request("https://raw.githubusercontent.com/BurntSushi/nflgame/master/nflgame/schedule.json", function(error, response, body) {

            if (error) {
                res.send(error);
            } else {

                var data = JSON.parse(response.body);
                var games = data.games;


                Game.find({
                        week: req.params.week
                    })
                    .exec(function(err, weekGames) {
                        if (err) {
                            res.send(err);
                        } else {

                            weekGames.forEach(function(weekGame, i) {
                                games.forEach(function(game, j) {
                                    if (game[0] == weekGame._id) {
                                        var currentTimeInET = new Date(game[1].year + "-" + game[1].month + "-" + game[1].day + " " + game[1].time);
                                        currentTimeInET.setTime(currentTimeInET.getTime() + (17 * 60 * 60 * 1000));
                                        console.log(currentTimeInET);
                                        weekGame.date = currentTimeInET;
                                        weekGame.save(function(err) {
                                            if (err) {
                                                winston.info(err);
                                            }
                                        });

                                    }
                                });
                            });

                            res.send(weekGames);
                        }
                    });
            }

        });

    });
}
