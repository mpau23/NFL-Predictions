NflPredictionsApp.controller('GamesCtrl', ['$scope', '$http', '$q', 'Game', function($scope, $http, $q, Game) {

    $scope.games;

    $scope.getGames = function() {

        var gamesArray = new Array;

        $http.get('/api/game')
            .then(function(response) {

                angular.forEach(response.data, function(value, key) {
                    date = new Date(value.date);
                    date.setHours(date.getHours()+5);
                    gamesArray.push(new Game(value._id, value.week, date.toString(), "", value.awayTeam._id, value.homeTeam._id));
                });

                $scope.games = gamesArray;
            });
    }

    $scope.pushGames = function() {

        var scheduleData;
        var centerData;
        var gamesArray = new Array;


        $http.get('/json/nfl-fixtures.json')
            .then(function(games) {
                scheduleData = games.data.Schedule;
                centerData = games.data.centerIds;

                var gameCount = 0;
                var thisWeeksGames;
                var thisGameId;

                angular.forEach(scheduleData, function(value, key) {

                    angular.forEach(centerData, function(value1, key1) {
                        if (value1.week === value.gameWeek)
                            thisWeeksGames = value1;

                        angular.forEach(thisWeeksGames.games, function(value2, key2) {
                            if (value2.home === value.homeTeam)
                                thisGameId = value2.id;
                        });

                    });

                    if (!thisWeeksGames.games[gameCount])
                        gameCount = 0;

                    gamesArray.push(new Game(thisGameId, value.gameWeek, value.gameDate, value.gameTimeET, value.awayTeam, value.homeTeam));
                    gameCount++;
                });

                angular.forEach(gamesArray, function(value, key) {
                    $http.post('/api/game', {
                        "id": value.id,
                        "week": value.week,
                        "homeTeam": value.homeTeamId,
                        "awayTeam": value.awayTeamId,
                        "date": value.date+" "+value.time
                    });
                });

            });


    };

    function getCenterData() {

        var rawData = new Array;

        for (var i = 1; i <= 17; i++) {
            $http.get('http://www.nfl.com/schedules/2015/REG' + i)
                .then(function(response) {
                    var weekData = response.data;
                    var parser = new DOMParser();
                    var doc = parser.parseFromString(weekData, 'text/html');
                    var elements = doc.getElementsByClassName('schedules-list-content');

                    var weekArray = new Array;

                    angular.forEach(elements, function(value, key) {
                        var game = {
                            id: value.getAttribute("data-gameid"),
                            home: value.getAttribute("data-home-abbr")
                        }
                        weekArray.push(game);
                    });

                    var regex = new RegExp("REG(.*)/");
                    var week = regex.exec(elements[0].getAttribute("data-gc-url"));

                    var jsonCenterData = {

                        week: week[1],
                        games: weekArray
                    };

                    rawData.push(jsonCenterData);
                });

        };


        return rawData;
    }


}]);
