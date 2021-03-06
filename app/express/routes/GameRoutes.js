var Game = require('../tables/GameTable');
var Team = require('../tables/TeamTable');
var winston = require('winston');
var request = require('request');
var cheerio = require('cheerio');
var parser = require('xml2json');

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

        var seasonType = 'REG';

        if (req.params.week > 17) {
            seasonType = 'POST';
        }

        request("http://www.nfl.com/ajax/scorestrip?season=2019&seasonType=" + seasonType + "&week=" + req.params.week, function(requestError, response, body) {

            if (requestError) {
                res.send(requestError);
            } else {

                var json = JSON.parse(parser.toJson(response.body));
                filteredGames = json["ss"]["gms"]["g"];
                
                Game.find({
                    week: req.params.week
                })
                .exec(function(err, weekGames) {
                    if (err) {
                       res.send(err);
                    } else {

                        filteredGames.forEach(function(currentFilteredGame, filteredIndex) {
                            var found = false;
                            
                            currentFilteredGame.date = {
                                year: currentFilteredGame["eid"].slice(0,4),
                                month: currentFilteredGame["eid"].slice(4,6),
                                day: currentFilteredGame["eid"].slice(6,8)
                            }
                            var currentTimeInET = new Date(currentFilteredGame.date.year + "-" + currentFilteredGame.date.month + "-" + currentFilteredGame.date.day + " " + currentFilteredGame["t"]);
                            currentTimeInET.setTime(currentTimeInET.getTime() + (16 * 60 * 60 * 1000));

                            weekGames.forEach(function(currentGame, index) {
                                if(currentFilteredGame["eid"] == currentGame._id) {
                                    currentGame.date = currentTimeInET;
                                    winston.info("Attempting to update game:" + currentFilteredGame["eid"]);
                                    currentGame.save(function(err) {
                                        if (err) {
                                            winston.info("Error updating game:" + currentFilteredGame["eid"]);
                                        } else {
                                            winston.info("Successfully updated game: " + currentFilteredGame["eid"]);
                                        }
                                    });
                                    found = true;                                  
                                }
                            });

                            if(found == false) {
                                var newGame = new Game({
                                    _id: currentFilteredGame["eid"],
                                    week: req.params.week,
                                    homeTeam: currentFilteredGame["h"],
                                    awayTeam: currentFilteredGame["v"],
                                    date: currentTimeInET
                                });
                                winston.info("Attempting to create game:" + newGame);
                                newGame.save(function(err) {
                                    if (err) {
                                        winston.info("Error creating game:" + currentFilteredGame["eid"]);
                                    } else {
                                        winston.info("Successfully creating game: " + currentFilteredGame["eid"]);
                                    }
                                });                                
                            }
                            
                        });

                        res.send(filteredGames);
                    }
                });
            }

        });

    });
}
