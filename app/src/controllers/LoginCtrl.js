NflPredictionsApp.controller('LoginCtrl', ['$scope', '$http', 'Authentication', '$location', function($scope, $http, Authentication, $location) {

    $scope.loginUsername = "";
    $scope.loginPassword = "";

    $scope.login = function() {
        $scope.dataLoading = true;

        Authentication.login($scope.loginUsername, $scope.loginPassword, function(response) {
            if (!response.error) {
                Authentication.setCredentials($scope.loginUsername, $scope.loginPassword);
                $location.path('/');
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


        Authentication.register($scope.registerUsername, $scope.registerPassword, $scope.registerName, $scope.registerEmail, function(response) {
            if (!response.error) {
                Authentication.setCredentials($scope.loginUsername, $scope.loginPassword);
                $location.path('/');
            } else {
                $scope.error = response.error;
            }
        });
    };

}]);
