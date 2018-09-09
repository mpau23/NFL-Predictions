NflPredictionsApp.factory('UserService', ['$http', '$q', 'User', 'LocalStorageWrapperService',
    function($http, $q, User, LocalStorageWrapperService) {

        var userService = {

            getAllUsers: function() {

                var usersFromStorage = LocalStorageWrapperService.get('getAllUsers');

                if (usersFromStorage) {

                    var deferred = $q.defer();

                    var userArray = new Array();
                    angular.forEach(usersFromStorage, function(user, key) {
                        userArray.push(new User(user.fullName, user.username));
                    });

                    deferred.resolve(userArray);

                    return deferred.promise;

                } else {

                    return $http.get('/api/get/user/all')
                        .then(function(response) {
                            if (response.data) {

                                LocalStorageWrapperService.set('getAllUsers', response.data, 720);

                                var userArray = new Array();
                                angular.forEach(response.data, function(user, key) {
                                    userArray.push(new User(user.fullName, user.username));
                                });

                                return userArray;

                            } else {
                                return $q.reject;
                            }
                        });
                }
            }

        }

        return userService;

    }
]);
