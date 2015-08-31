NflPredictionsApp.controller('GamesCtrl', ['$scope', '$rootScope', '$http', '$q', '$stateParams', 'Game', 'Team', 'Prediction', function($scope, $rootScope, $http, $q, $stateParams, Game, Team, Prediction) {

    $scope.games = getGames();

    function getGames() {

        var gamesArray = new Array;

        $http.get('/api/game/' + $stateParams.week)
            .then(function(response) {

                angular.forEach(response.data, function(value, key) {
                    date = new Date(value.date);
                    date.setHours(date.getHours() + 5);
                    gamesArray.push(
                        new Game(
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
                        )
                    );
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
                    });

                })

            });

        return gamesArray;
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

                    gamesArray.push(new Game(
                        thisGameId,
                        value.gameWeek,
                        value.gameDate + " " + value.gameTimeET,
                        value.awayTeam,
                        value.homeTeam));
                    gameCount++;
                });

                angular.forEach(gamesArray, function(value, key) {
                    $http.post('/api/game', {
                        "id": value.id,
                        "week": value.week,
                        "homeTeam": value.homeTeamId,
                        "awayTeam": value.awayTeamId,
                        "date": value.date
                    });
                });

            });


    };

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
                        };
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
