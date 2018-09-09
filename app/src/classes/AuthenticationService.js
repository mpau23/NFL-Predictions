NflPredictionsApp.factory('AuthenticationService', ['Base64', '$http', '$cookies', '$rootScope',
    function(Base64, $http, $cookies, $rootScope) {

        // instantiate our initial object
        var service = {

            login: function(username, password, callback) {

                console.log('Attempting to log in');

                $http.get('/api/get/user/by-login/' + Base64.encode(username + ':' + password))
                    .then(function(response) {
                        if (!response.data) {
                            response.error = true;
                        }
                        callback(response);
                    });

            },

            register: function(username, password, user, email, callback) {
                $http.post('/api/post/user', {
                        "fullName": user,
                        "email": email,
                        "id": Base64.encode(username + ':' + password),
                        "username": username
                    })
                    .then(function(response) {
                        if (!response.data._id) {
                            response.error = true;
                        }
                        callback(response);
                    });

            },

            setCredentials: function(username, password) {

                console.log('Setting credentials')
                var authdata = Base64.encode(username + ':' + password);

                console.log('Basic ' + authdata);
                $rootScope.currentUser = authdata;
                $http.defaults.headers.common.Authorization = 'Basic ' + authdata; // jshint ignore:line
                $cookies.put('currentUser', $rootScope.currentUser);
            },

            clearCredentials: function() {

                delete $rootScope.currentUser;
                $cookies.remove('currentUser');
                $http.defaults.headers.common.Authorization = 'Basic auth';
            }

        };

        return service;
    }
]);
