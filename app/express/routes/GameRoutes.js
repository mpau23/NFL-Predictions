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

        request("https://raw.githubusercontent.com/BurntSushi/nflgame/master/nflgame/schedule.json", function(requestError, response, body) {

            if (requestError) {
                res.send(requestError);
            } else {

                var data = JSON.parse(response.body);
                var filteredGames = data.games.filter(function(element) {
                    return element[1].year >= 2017 &&
                        element[1].month >= 9 &&
                        element[1].week == req.params.week;
                });
                winston.info("Number of filtered games: " + filteredGames.length)


                Game.find({
                    week: req.params.week
                })
                .exec(function(err, weekGames) {
                    if (err) {
                       res.send(err);
                    } else {

                        if(weekGames.length > 0) {

                            weekGames.forEach(function(currentGame, index) {
                                filteredGames.forEach(function(currentFilteredGame, filteredIndex) {
                                    
                                    var currentTimeInET = new Date(currentFilteredGame[1].year + "-" + currentFilteredGame[1].month + "-" + currentFilteredGame[1].day + " " + currentFilteredGame[1].time);
                                    currentTimeInET.setTime(currentTimeInET.getTime() + (17 * 60 * 60 * 1000));

                                    if(currentFilteredGame[0] == currentGame._id) {
                                        currentGame.date = currentTimeInET;

                                        winston.info("Attempting to update game:" + newGame);


                                        currentGame.save(function(err) {
                                            if (err) {
                                                winston.info("Error updating game:" + currentFilteredGame[0]);
                                            } else {
                                                winston.info("Successfully updated game: " + currentFilteredGame[0]);
                                            }
                                        });

                                    } else {
                                        var newGame = new Game({
                                            _id: currentFilteredGame[0],
                                            week: req.params.week,
                                            homeTeam: currentFilteredGame[1].home,
                                            awayTeam: currentFilteredGame[1].away,
                                            date: currentTimeInET
                                        });

                                        winston.info("Attempting to save game:" + newGame);

                                        newGame.save(function(err) {
                                            if (err) {
                                                winston.info("Error saving game:" + currentFilteredGame[0]);
                                            } else {
                                                winston.info("Successfully saved game: " + currentFilteredGame[0]);
                                            }
                                        });
                                    }
                                })
                            });

                        } else {
                            filteredGames.forEach(function(currentGame, index) {
                                var currentTimeInET = new Date(currentGame[1].year + "-" + currentGame[1].month + "-" + currentGame[1].day + " " + currentGame[1].time);
                                currentTimeInET.setTime(currentTimeInET.getTime() + (17 * 60 * 60 * 1000));

                                var newGame = new Game({
                                    _id: currentGame[0],
                                    week: req.params.week,
                                    homeTeam: currentGame[1].home,
                                    awayTeam: currentGame[1].away,
                                    date: currentTimeInET
                                });

                                winston.info("Attempting to save game:" + newGame);

                                newGame.save(function(err) {
                                    if (err) {
                                        winston.info("Error saving game:" + currentGame[0]);
                                    } else {
                                        winston.info("Successfully saved game: " + currentGame[0]);
                                    }
                                });
                            })
                        }
                        res.send(filteredGames);
                    }
                });
            }

        });

    });
}
