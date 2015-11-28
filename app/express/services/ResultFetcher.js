var Game = require('../tables/GameTable');
var Team = require('../tables/TeamTable');
var request = require('request');
var winston = require('winston');

module.exports = {

    fetchGameResult: function() {

        winston.info("fetching current games...");

        var currentTimeInET = new Date();
        var currentTimeInET = currentTimeInET.setHours(currentTimeInET.getHours() - 5); //5

        var gamesStartedAfterTime = new Date();
        var gamesStartedAfterTime = gamesStartedAfterTime.setHours(gamesStartedAfterTime.getHours() - 17); //11

        Game.find({
                date: {
                    $lte: currentTimeInET
                }
            })
            .populate('awayTeam')
            .populate('homeTeam')
            .exec(function(err, games) {
                if (err) {
                    winston.info(err);
                } else {

                    if (games.length > 0) {
                        var gameIds = new Array();
                        games.forEach(function(game, index) {

                            if (game.date > gamesStartedAfterTime || (typeof game.awayScore === 'undefined' || typeof game.homeScore === 'undefined')) {
                                winston.info("Fetching live data for game: " + game._id);

                                request('http://www.nfl.com/liveupdate/game-center/' + game._id + '/' + game._id + '_gtd.json',
                                    function(error, response, body) {
                                        if (!error && response.statusCode == 200) {

                                            var rawData = JSON.parse(body);
                                            var parsedGameData;

                                            for (var key in rawData) {
                                                if (rawData.hasOwnProperty(key)) {

                                                    if (rawData[key].hasOwnProperty('home')) {
                                                        parsedGameData = rawData[key];
                                                    }
                                                }
                                            }

                                            if (typeof parsedGameData !== 'undefined') {
                                                winston.info("Data retrieved successfully");

                                                game.awayScore = parsedGameData.away.score.T;
                                                game.homeScore = parsedGameData.home.score.T;

                                                game.save(function(err) {
                                                    if (err) {
                                                        winston.info("Error saving game result");
                                                    } else {
                                                        winston.info("Result updated successfully");
                                                    }
                                                });

                                            } else {
                                                winston.info("Data corrupted");
                                            }


                                        } else {
                                            winston.info("Unable to get game data: " + error);
                                        }
                                    });
                            }
                        });
                    } else {
                        winston.info("No games found");
                    }
                }
            });

    },

    saveGameResult: function(game, awayScore, homeScore) {

        return "saved";
    }
};
