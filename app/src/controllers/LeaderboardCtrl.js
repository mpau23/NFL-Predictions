NflPredictionsApp.controller('LeaderboardCtrl', ['$scope', '$http', '$q', 'Results', 'User',
    function($scope, $http, $q, Results, User) {

        var userArray = new Array();

        generateLeaderboard();

        function calculatePoints(game, awayScore, homeScore) {

            angular.forEach(userArray, function(user, key) {

                if (user.predictions[game._id]) {

                    var correctPoints = false;
                    var correctTeam = false;
                    var correctExactScore = false;
                    var points = 0;

                    if ((awayScore + homeScore) == (user.predictions[game._id].awayPrediction + user.predictions[game._id].homePrediction)) {
                        correctPoints = true;
                    }

                    if (awayScore < homeScore && user.predictions[game._id].awayPrediction < user.predictions[game._id].homePrediction) {
                        correctTeam = true;
                    }

                    if (awayScore > homeScore && user.predictions[game._id].awayPrediction > user.predictions[game._id].homePrediction) {
                        correctTeam = true;
                    }

                    if (awayScore == homeScore && user.predictions[game._id].awayPrediction == user.predictions[game._id].homePrediction) {
                        correctTeam = true;
                    }

                    if (awayScore == user.predictions[game._id].awayPrediction && homeScore == user.predictions[game._id].homePrediction) {
                        correctExactScore = true;
                    }

                    if (correctPoints) {
                        points += 5;
                    }

                    if (correctTeam) {
                        points += 10;
                    }

                    if (correctExactScore) {
                        points += 15;
                    }

                    if (user.predictions[game._id].joker) {
                        points *= 2;
                    }

                    user.addPoints(points);

                }

            });

        }


        function generateLeaderboard() {

            var date = new Date();

            var usersPromise = $http({
                method: 'GET',
                url: '/api/user',
                cache: 'true'
            });

            var gamesPromise = $http({
                method: 'GET',
                url: '/api/games/' + date,
                cache: 'true'
            });

            $q.all([usersPromise, gamesPromise]).then(function(response) {

                var users = response[0].data;
                var games = response[1].data;

                var predictionPromises = new Array();

                angular.forEach(users, function(value, key) {

                    var user = new User(value.fullName, value.username);

                    var predictionPromise = $http.get('/api/predictions/user/' + value.username)
                        .then(function(response) {

                            angular.forEach(response.data, function(prediction, key) {
                                user.addPrediction(prediction);
                            });

                        });

                    predictionPromises.push(predictionPromise);
                    userArray.push(user);

                });

                $q.all(predictionPromises).then(function() {

                    var apiPromises = new Array();

                    angular.forEach(games, function(game, key) {

                        var gameDate = new Date(game.date);
                        gameDate.setHours(gameDate.getHours() + 5);
                        var gameAwayScore = 0;
                        var gameHomeScore = 0;

                        if (game.hasOwnProperty('homeScore') && game.hasOwnProperty('awayScore')) {

                            gameAwayScore = game.awayScore;
                            gameHomeScore = game.homeScore;

                            calculatePoints(game, gameAwayScore, gameHomeScore);

                        } else {

                            var apiPromise = $http.get('/api/results/' + game._id)
                                .then(function(response) {

                                    tempGameResultArray = new Array();
                                    angular.forEach(response.data, function(result, key) {
                                        tempGameResultArray.push(result);
                                    });

                                    gameAwayScore = tempGameResultArray[0].away.score.T;
                                    gameHomeScore = tempGameResultArray[0].home.score.T;


                                    var finishedGameTime = new Date(gameDate);
                                    finishedGameTime.setHours(finishedGameTime.getHours() + 6);

                                    if (date > finishedGameTime) {
                                        $http.post('/api/update/game/score', {
                                            "game": game._id,
                                            "homeScore": gameHomeScore,
                                            "awayScore": gameAwayScore
                                        });
                                    }

                                })
                                .then(function() {
                                    calculatePoints(game, gameAwayScore, gameHomeScore);
                                });


                            apiPromises.push(apiPromise);

                        }

                        console.log("test");

                    });

                    $q.all(apiPromises).then(function() {
                        userArray.sort(function(a, b) {
                            return (a.points < b.points) ? 1 : ((b.points < a.points) ? -1 : 0);
                        });
                        console.log("finished");

                        $scope.users = userArray;

                    });


                });

            });
        }
    }
]);
