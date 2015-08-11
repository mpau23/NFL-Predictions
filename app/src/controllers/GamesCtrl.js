NflPredictionsApp.controller('GamesCtrl', ['$scope', '$http', 'Game', function($scope, $http, Game) {

    $scope.games = getGames();

    function getGames() {

        var jsonData;
        var gamesArray = new Array;


        $http.get('/json/nfl-fixtures.json')
            .then(function(games) {
                jsonData = games.data.Schedule;

                angular.forEach(jsonData, function(value, key) {
                    gamesArray.push(new Game(value.gameId, value.gameWeek, value.gameDate, value.awayTeam, value.homeTeam));
                });

            });

        return gamesArray;
    }

}]);