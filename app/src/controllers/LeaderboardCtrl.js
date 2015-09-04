NflPredictionsApp.controller('LeaderboardCtrl', ['$scope', '$http', 'User', 'Prediction', 'Game', 'Team',
    function($scope, $http, User, Prediction, Game, Team) {

        $scope.leaderboard = leaderboard();


        function leaderboard() {

            var users = new Array;

            $http.get('/api/user').then(function(response) {

                angular.forEach(response.data, function(value, key) {

                    var user = new User(value.fullName, value.username);


                    $http.get('/api/prediction/' + value.username)
                        .then(function(response) {

                            angular.forEach(response.data, function(value, key) {
                                var date = new Date(value.game.date);
                                date.setHours(date.getHours() + 5);

                                var prediction = new Game(
                                    value.game._id,
                                    value.game.week,
                                    date.toString(),
                                    new Team(
                                        value.game.awayTeam._id,
                                        value.game.awayTeam.shortName,
                                        value.game.awayTeam.fullName),
                                    new Team(value.game.homeTeam._id,
                                        value.game.homeTeam.shortName,
                                        value.game.homeTeam.fullName),
                                    new Prediction(value.homePrediction,
                                        value.awayPrediction,
                                        value.joker)
                                )

                                user.addPrediction(prediction);
                            });

                        }).then(function() {
                            users.push(user);
                            console.log(user);
                        });

                });

            }).then(function() {
                console.log(users);
            });

            return users;
        }

    }
]);
