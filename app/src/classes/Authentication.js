NflPredictionsApp.factory('Authentication', ['Base64', '$http', '$cookies', '$rootScope', '$timeout',
    function(Base64, $http, $cookies, $rootScope, $timeout) {

        // instantiate our initial object
        var service = {

            login: function(username, password, callback) {

                $http.get('/api/user/' + username + "/" + password)
                    .then(function(response) {
                        if (!response.data) {
                            response.error = 'Username or password is incorrect';
                        }
                        callback(response);
                    });

            },

            register: function(username, password, user, email, callback) {

                $http.post('/api/user', {
                        "fullName": user,
                        "email": email,
                        "username": username,
                        "password": password,
                    })
                    .then(function(response) {
                        if (!response.data._id) {
                            response.error = 'There was a problem creating an account';
                        }
                        callback(response);
                    });

            },

            setCredentials: function(username, password) {
                var authdata = Base64.encode(username + ':' + password);

                $rootScope.currentUser = authdata;

                $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
                $cookies.put('currentUser', $rootScope.currentUser);
            },

            clearCredentials: function() {
                delete $rootScope.currentUser;
                $cookies.remove('currentUser');
                $http.defaults.headers.common.Authorization = 'Basic ';
            }

        };

        return service;
    }
]);
