NflPredictionsApp.controller('UpdateGameCtrl', ['$scope', 'GameService', function($scope, GameService) {

    $scope.getNumberOfWeeks = function() {
        return new Array(17);
    }

    $scope.updateGame = function() {

        var date = new Date($scope.selectedGameDate);
        date.setHours(date.getHours() - 5);

        GameService.updateGameForId($scope.selectedGame, $scope.selectedGameAwayScore, $scope.selectedGameHomeScore, date);
    };

    $scope.changeWeek = function(week) {

        $scope.selectedGame = null;
        $scope.selectedGameAwayScore = "";
        $scope.selectedGameHomeScore = "";
        $scope.selectedGameDate = "";

        GameService.getThisWeekGames(week).then(function(response) {
            $scope.thisWeeksGames = response;
        });
    };

    $scope.changeGame = function(id) {

        angular.forEach($scope.thisWeeksGames, function(game, key) {
            if (game.id == id) {
                $scope.selectedGame = game.id;
                $scope.selectedGameAwayScore = game.awayScore;
                $scope.selectedGameHomeScore = game.homeScore;
                $scope.selectedGameDate = game.date;
            }
        })

    };


}]);
