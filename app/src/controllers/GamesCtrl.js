NflPredictionsApp.controller('GamesCtrl', ['$scope', '$rootScope', '$q', '$stateParams', 'GameService', 'PredictionService', 'ScoreService',
    function($scope, $rootScope, $q, $stateParams, GameService, PredictionService, ScoreService) {

        $scope.jokerChosen = "";

        getGames();

        function getGames() {

            var games = new Array();
            var predictions = new Array();

            var gamesForThisWeek = GameService.getThisWeekGames($stateParams.week);
            var predictionsForThisWeek = PredictionService.getThisWeekPredictions($rootScope.currentUser, $stateParams.week);

            $q.all([gamesForThisWeek, predictionsForThisWeek]).then(function(response) {

                games = response[0];
                predictions = response[1];


                angular.forEach(games, function(game, key) {
                    if (predictions[game.id]) {
                        game.prediction = predictions[game.id];

                        if (game.started) {
                            if (game.awayScore != null && game.homeScore != null) {
                                game.points = ScoreService.calculatePoints(
                                    game.awayScore,
                                    game.homeScore,
                                    game.prediction.awayPrediction,
                                    game.prediction.homePrediction,
                                    game.prediction.joker
                                );
                            }

                            if (game.prediction.joker) {
                                $scope.jokerChosen = "chosen";
                            }
                        }
                    }

                });

                $scope.games = games;

            });
        }

        $scope.submit = function() {

            angular.forEach($scope.games, function(game, key) {
                PredictionService.setPredictionForGame($rootScope.currentUser, game);
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
