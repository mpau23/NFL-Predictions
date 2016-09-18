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

        request("http://www.nfl.com/schedules/2016/REG" + week, function(error, response, body) {
            if (!error) {

                var htmlData = cheerio.load(body);

                htmlData('.schedules-list-content').each(function() {

                    console.log(htmlData(this).data("gameid"));
                    console.log(htmlData(this).data("away-abbr"));
                    console.log(htmlData(this).data("home-abbr"));

                    var gameid = htmlData(this).data("gameid").toString();
                    var gameAwayTeam = htmlData(this).data("away-abbr").toString();
                    var gameHomeTeam = htmlData(this).data("home-abbr").toString();
                    var gametime = htmlData(this).data("localtime").toString();
                    var gameyear = gameid.substring(0, 4);
                    var gamemonth = gameid.substring(4, 6);
                    var gameday = gameid.substring(6, 8);

                    var currentTimeInET = new Date(gameyear + "-" + gamemonth + "-" + gameday + " " + gametime);
                    console.log(currentTimeInET);
                    currentTimeInET.setTime(currentTimeInET.getTime() + (4 * 60 * 60 * 1000));
                    console.log(currentTimeInET);

                    Game.findById(gameid, function(err, game) {
                        if (err) {
                            winston.info(err);
                        } else {

                            if (game) {
                                winston.info("Game " + gameid + " exists...updating");
                                game.date = currentTimeInET;
                                game.save(function(err) {
                                    if (err) {
                                        winston.info(err);
                                    }
                                });

                            } else {
                                winston.info("Creating new data for game " + gameid);
                                game = new Game({
                                    _id: gameid,
                                    week: week,
                                    homeTeam: gameHomeTeam,
                                    awayTeam: gameAwayTeam,
                                    date: currentTimeInET
                                });

                                game.save(function(err) {
                                    if (err) {
                                        winston.info(err);
                                    }

                                });
                            }
                        }
                    });

                });

                res.send(true);

            } else {
                winston.info(err);
            }
        });

    });
}
