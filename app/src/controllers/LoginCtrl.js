NflPredictionsApp.controller('LoginCtrl', ['$scope', '$http', 'AuthenticationService', '$location', function($scope, $http, AuthenticationService, $location) {

    $scope.loginUsername = "";
    $scope.loginPassword = "";

    AuthenticationService.clearCredentials();

    $scope.login = function() {
        $scope.dataLoading = true;

        AuthenticationService.login($scope.loginUsername, $scope.loginPassword, function(response) {
            if (!response.error) {
                AuthenticationService.setCredentials($scope.loginUsername, $scope.loginPassword);
                $location.path('/leaderboard');
            } else {
                $scope.error = response.error;
            }
        });
    };

    $scope.registerUsername = "";
    $scope.registerPassword = "";
    $scope.registerName = "";
    $scope.registerEmail = "";

    $scope.register = function() {


        AuthenticationService.register($scope.registerUsername, $scope.registerPassword, $scope.registerName, $scope.registerEmail, function(response) {
            if (!response.error) {
                AuthenticationService.setCredentials($scope.registerUsername, $scope.registerPassword);
                $location.path('/leaderboard');
            } else {
                $scope.error = response.error;
            }
        });
    };

}]);
