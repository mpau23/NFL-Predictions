NflPredictionsApp.controller('LeaderboardCtrl', ['$scope', '$http', '$q', 'User', 'Prediction', 'Game', 'Team', 'Results',
    function($scope, $http, $q, User, Prediction, Game, Team, Results) {

        $scope.leaderboard = newLeaderboard();

        function newLeaderboard() {

            var users = new Array();

            $http.get('/api/user')
                .then(function(response) {

                    angular.forEach(response.data, function(value, key) {
                        users.push(new User(value.fullName, value.username));
                    });

                    $http.get('/api/game')
                        .then(function(response) {
                            angular.forEach(response.data, function(value, key) {

                                var now = new Date();
                                now.setHours(now.getHours() + 168);

                                var gameDate = new Date(value.date);
                                gameDate.setHours(gameDate.getHours() + 5);

                                if (now > gameDate) {
                                    $http.get('/api/results/' + value._id)
                                        .then(function(response) {

                                            responseObj = new Array();
                                            angular.forEach(response.data, function(valueObj, keyObj) {
                                                responseObj.push(valueObj);
                                            });

                                            var result = new Results(
                                                value._id,
                                                value.week,
                                                responseObj[0].away.score.T,
                                                responseObj[0].home.score.T
                                            );

                                            angular.forEach(users, function(user, key) {

                                                $http.get('/api/prediction/results/' + value._id + "/" + user.username)
                                                    .then(function(response) {

                                                        console.log(response);

                                                        if (response.data) {
                                                            var correctPoints = false;
                                                            var correctTeam = false;
                                                            var points = 0;

                                                            if ((result.awayScore + result.homeScore) == (response.data.awayPrediction + response.data.homePrediction)) {
                                                                correctPoints = true;
                                                            }

                                                            if (result.awayScore < result.homeScore && response.data.awayPrediction < response.data.homePrediction) {
                                                                correctTeam = true;
                                                            }

                                                            if (result.awayScore > result.homeScore && response.data.awayPrediction > response.data.homePrediction) {
                                                                correctTeam = true;
                                                            }

                                                            if (result.awayScore == result.homeScore && response.data.awayPrediction == response.data.homePrediction) {
                                                                correctTeam = true;
                                                            }

                                                            if (correctPoints) {
                                                                points += 5;
                                                            }

                                                            if (correctTeam) {
                                                                points += 10;
                                                            }

                                                            if (response.data.joker) {
                                                                points *= 2;
                                                            }

                                                            user.addPoints(points);
                                                        }
                                                    });
                                            });

                                        });

                                }


                            });
                        })
                        .then(function() {


                        });
                });

            $scope.users = users;
            return results;
        };
    }
]);
