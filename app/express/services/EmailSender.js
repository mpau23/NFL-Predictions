var Game = require('../tables/GameTable');
var User = require('../tables/UserTable');
var Prediction = require('../tables/PredictionTable');
var request = require('request');
var winston = require('winston');
var nodemailer = require('nodemailer');
var path = require('path');
var fs = require('fs');
require('datejs');

module.exports = {

    sendEmail: function() {

        var currentTime = Date.today().setTimeToNow();
        var timeInNextHour = Date.today().setTimeToNow().addHours(1);

        winston.info("Looking for games between " + currentTime + " and " + timeInNextHour);

        User.find({}, 'fullName email', function(err, users) {

            if (err) {
                winston.info(err);
            } else {

                Game.find({
                        date: {
                            $lte: timeInNextHour,
                            $gte: currentTime
                        }
                    })
                    .exec(function(err, games) {
                        if (err) {
                            winston.info(err);
                        } else {

                            if (games.length < 1) {
                                winston.info("No games starting in the next hour");
                            } else {

                                var gameIds = new Array();
                                games.forEach(function(game, index) {
                                    gameIds.push(game._id);
                                });

                                users.forEach(function(user, index) {

                                    Prediction.find({
                                            'user': user._id,
                                        }, '-_id game awayPrediction homePrediction joker')
                                        .where('game').in(gameIds)
                                        .populate('game')
                                        .exec(function(err, predictions) {

                                            if (err) {
                                                winston.info(err);
                                            } else {
                                                if (predictions.length < 1) {
                                                    winston.info(user.fullName + " is currently missing " + games.length + " predictions (no predictions made)");
                                                    module.exports.composeEmail(user, games);
                                                } else {
                                                    var gamesToAdd = new Array();
                                                    predictions.forEach(function(prediction, index) {
                                                        if (prediction.awayPrediction === 0 && prediction.homePrediction === 0) {
                                                            gamesToAdd.push(prediction.game);
                                                        }
                                                    });
                                                    if (gamesToAdd.length > 0) {
                                                        winston.info(user.fullName + " is currently missing " + gamesToAdd.length + " predictions (some predictions made)");
                                                        module.exports.composeEmail(user, gamesToAdd);
                                                    }

                                                }
                                            }
                                        });

                                });

                            }
                        }
                    });
            }
        });

    },
    composeEmail: function(user, games) {

        var htmlEmail = "<b>Hurry " + user.fullName + "! You don't have much time to put in these upcoming predictions!</b><br>";

        games.forEach(function(game, index) {
            var gameHtml = "<p>" + game.homeTeam + " vs. " + game.awayTeam + " (" + game.date + ")<p>";
            htmlEmail += gameHtml;
        });

        // create reusable transporter object using the default SMTP transport

        var emailCreds = JSON.parse(fs.readFileSync(path.resolve(__dirname + '/../data/emailCreds.json')));

        var transporter = nodemailer.createTransport({
            service: "hotmail",
            auth: {
                user: emailCreds.email,
                pass: emailCreds.password
            }
        });

        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: '"Miren Pau" <' + emailCreds.email + '>', // sender address
            to: user.email, // list of receivers
            subject: 'Missing Predictions!', // Subject line
            text: htmlEmail, // plaintext body
            html: htmlEmail // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);

        });

    }
};
