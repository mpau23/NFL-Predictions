NflPredictionsApp.controller('LeaderboardCtrl', ['$scope', '$http', '$q', 'Results', 'User',
    function($scope, $http, $q, Results, User) {

        var userArray = new Array();

        $scope.users = userArray;

        generateLeaderboard();

        function calculatePoints(game, awayScore, homeScore) {

            var pointsPromises = new Array();

            angular.forEach(userArray, function(user, key) {

                var pointsPromise = $http.get('/api/prediction/results/' + game._id + "/" + user.username)
                    .then(function(response) {

                        if (response.data) {
                            var correctPoints = false;
                            var correctTeam = false;
                            var correctExactScore = false;
                            var points = 0;

                            if ((awayScore + homeScore) == (response.data.awayPrediction + response.data.homePrediction)) {
                                correctPoints = true;
                            }

                            if (awayScore < homeScore && response.data.awayPrediction < response.data.homePrediction) {
                                correctTeam = true;
                            }

                            if (awayScore > homeScore && response.data.awayPrediction > response.data.homePrediction) {
                                correctTeam = true;
                            }

                            if (awayScore == homeScore && response.data.awayPrediction == response.data.homePrediction) {
                                correctTeam = true;
                            }

                            if (awayScore == response.data.awayPrediction && homeScore == response.data.homePrediction) {
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

                            if (response.data.joker) {
                                points *= 2;
                            }

                            user.addPoints(points);
                        }
                    });

                pointsPromises.push(pointsPromise);

            });

            $q.all(pointsPromises).then(function() {
                userArray.sort(function(a, b) {
                    return (a.points < b.points) ? 1 : ((b.points < a.points) ? -1 : 0);
                });
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

                    angular.forEach(users, function(value, key) {
                        userArray.push(new User(value.fullName, value.username));
                    });

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

                            $http.get('/api/results/' + game._id)
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

                        }

                    });

                })
                .then(function() {
                    return userArray;
                });
        }
    }
]);
