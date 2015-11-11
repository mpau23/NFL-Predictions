NflPredictionsApp.factory('GameService', ['$http', '$q', 'Game', 'Team', function($http, $q, Game, Team) {

    var gameService = {

        getThisWeekGames: function(week) {

            return gamesPromise = $http.get('/api/get/game/week/' + week)
                .then(function(response) {
                    if (response.data) {

                        var gamesArray = new Array();

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

                            if ((typeof value.awayScore !== 'undefined') && (typeof value.homeScore !== 'undefined')) {
                                game.awayScore = value.awayScore;
                                game.homeScore = value.homeScore;
                            }

                            var now = new Date();
                            var gamedate = new Date(date);

                            if (now > gamedate) {
                                game.started = true;

                            }

                            gamesArray.push(game);
                        });

                        return gamesArray;

                    } else {
                        return $q.reject;
                    }
                });
        },

        getGamesBeforeDate: function(date) {
            return gamesPromise = $http.get('/api/get/game/before-date/' + date)
                .then(function(response) {
                    if (response.data) {
                        
                        var gamesArray = new Array();

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

                            if ((typeof value.awayScore !== 'undefined') && (typeof value.homeScore !== 'undefined')) {
                                game.awayScore = value.awayScore;
                                game.homeScore = value.homeScore;
                            }

                            var now = new Date();
                            var gamedate = new Date(date);

                            if (now > gamedate) {
                                game.started = true;
                            }

                            gamesArray.push(game);
                        });

                        return gamesArray;

                    } else {
                        return $q.reject;
                    }
                });
        }

    }

    return gameService;

}]);
