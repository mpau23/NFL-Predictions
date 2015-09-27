NflPredictionsApp.controller('GamesCtrl', ['$scope', '$rootScope', '$http', '$q', '$stateParams', 'Game', 'Team', 'Prediction',
    function($scope, $rootScope, $http, $q, $stateParams, Game, Team, Prediction) {

        $scope.games = getGames();
        $scope.jokerChosen = "";
        $scope.date = new Date();

        function getGames() {

            var gamesArray = new Array;

            $http.get('/api/game/' + $stateParams.week)
                .then(function(response) {

                    angular.forEach(response.data, function(value, key) {
                        date = new Date(value.date);
                        date.setHours(date.getHours() + 5);

                        var game = new Game(
                            value._id,
                            value.week,
                            date.toString(),
                            new Team(
                                value.awayTeam._id,
                                value.awayTeam.shortName,
                                value.awayTeam.fullName),
                            new Team(value.homeTeam._id,
                                value.homeTeam.shortName,
                                value.homeTeam.fullName)
                        );

                        if (value.awayScore && value.homeScore) {
                            game.awayScore = value.awayScore;
                            game.homeScore = value.homeScore;
                        }

                        gamesArray.push(game);
                    });

                })
                .then(function() {
                    angular.forEach(gamesArray, function(value, key) {
                        $http.get('/api/prediction/' + value.id + "/" + $rootScope.currentUser).then(function(response) {
                            if (response.data) {
                                value.prediction = new Prediction(response.data.homePrediction, response.data.awayPrediction, response.data.joker);
                            } else {
                                value.prediction = new Prediction(0, 0, false);

                            }
                            var now = new Date();
                            var gamedate = new Date(value.date);

                            if (now > gamedate) {
                                value.started = true;

                                if (value.awayScore != null && value.homeScore != null) {
                                    value.points = calculatePoints(value);
                                }
                            }

                            if (value.started && value.prediction.joker) {
                                $scope.jokerChosen = "chosen";
                            }

                        });

                    });

                });

            return gamesArray;
        }

        function calculatePoints(game) {

            var correctPoints = false;
            var correctTeam = false;
            var correctExactScore = false;
            var points = 0;

            if ((game.awayScore + game.homeScore) == (game.prediction.awayPrediction + game.prediction.homePrediction)) {
                correctPoints = true;
            }

            if (game.awayScore < game.homeScore && game.prediction.awayPrediction < game.prediction.homePrediction) {
                correctTeam = true;
            }

            if (game.awayScore > game.homeScore && game.prediction.awayPrediction > game.prediction.homePrediction) {
                correctTeam = true;
            }

            if (game.awayScore == game.homeScore && game.prediction.awayPrediction == game.prediction.homePrediction) {
                correctTeam = true;
            }

            if (game.awayScore == game.prediction.awayPrediction && game.homeScore == game.prediction.homePrediction) {
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

            if (game.prediction.joker) {
                points *= 2;
            }

            return points;

        }

        $scope.submit = function() {


            angular.forEach($scope.games, function(value, key) {

                $http.post('/api/prediction', {
                    "user": $rootScope.currentUser,
                    "game": value.id,
                    "homePrediction": value.prediction.homePrediction,
                    "awayPrediction": value.prediction.awayPrediction,
                    "joker": value.prediction.joker
                });


            });



        };

        $scope.jokerChange = function(game) {

            angular.forEach($scope.games, function(value, key) {

                if (game != value) {
                    value.prediction.joker = false;
                }



            });
        }

    }
]);
