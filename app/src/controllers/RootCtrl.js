//Initialize application
var NflPredictionsApp = angular.module('NflPredictionsApp', ["ui.router"]);

//Root controller for application
NflPredictionsApp.controller('RootCtrl', ['$scope', function($scope) {

    $scope.author = "Miren Pau";

}]);

NflPredictionsApp.controller('TeamsCtrl', ['$scope', '$http', 'Team', function($scope, $http, Team) {

    $scope.teams = getTeams();

    function getTeams() {

        var jsonData;
        var teamsArray = new Array;


        $http.get('/json/nfl-teams.json')
            .then(function(teams) {
                jsonData = teams.data.NFLTeams;

                angular.forEach(jsonData, function(value, key) {
                    teamsArray.push(new Team(value.code, value.fullName));
                });

            });

        return teamsArray;
    }

}]);

