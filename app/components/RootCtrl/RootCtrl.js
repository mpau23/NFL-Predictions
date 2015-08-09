//Initialize application
var NflPredictionsApp = angular.module('NflPredictionsApp', []);

//Root controller for application
NflPredictionsApp.controller('RootCtrl', ['$scope', function($scope) {
    $scope.msg = "Hello World";
}]);
