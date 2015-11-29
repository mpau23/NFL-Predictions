NflPredictionsApp.controller('LeaderboardCtrl', ['$scope', '$q', 'Results', 'UserService', 'GameService', 'PredictionService', 'ScoreService',
    function($scope, $q, Results, UserService, GameService, PredictionService, ScoreService) {

        generateNewLeaderboard();

        function generateNewLeaderboard() {

            var date = new Date();
            var startOfGameWeek = Date.parse('last wednesday');
            var usersPromise = UserService.getAllUsers();
            var gamesPromise = GameService.getGamesBeforeDate(date);

            $q.all([usersPromise, gamesPromise]).then(function(response) {

                var allUsers = response[0];
                var gamesThatStarted = response[1];
                var userPredictionsPromisesArray = new Array();

                angular.forEach(allUsers, function(user, key) {

                    var userPredictionsPromise = PredictionService.getPredictionsBeforeDate(user.username, date);

                    userPredictionsPromise.then(function(response) {
                        user.predictions = response;
                    });

                    userPredictionsPromisesArray.push(userPredictionsPromise);

                });

                $q.all(userPredictionsPromisesArray).then(function(response) {

                    angular.forEach(gamesThatStarted, function(game, key) {

                        angular.forEach(allUsers, function(user, key) {

                            if (typeof game.awayScore === 'undefined' || typeof game.homeScore === 'undefined') {
                                console.log(game);
                            }

                            if (user.predictions[game.id] && typeof game.awayScore !== 'undefined' && typeof game.homeScore !== 'undefined') {

                                var pointsForPrediction = ScoreService.calculatePoints(
                                    game.awayScore,
                                    game.homeScore,
                                    user.predictions[game.id].awayPrediction,
                                    user.predictions[game.id].homePrediction,
                                    user.predictions[game.id].joker
                                );

                                user.addPoints(pointsForPrediction);

                                if (new Date(game.date) > Date.parse('last wednesday')) {

                                    user.addThisWeekPoints(pointsForPrediction);
                                }

                            }
                        });

                    });

                    allUsers.sort(function(a, b) {
                        return (a.points < b.points) ? 1 : ((b.points < a.points) ? -1 : 0);
                    });


                    $scope.users = allUsers;
                });

            });
        }
    }
]);
