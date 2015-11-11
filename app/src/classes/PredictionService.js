NflPredictionsApp.factory('PredictionService', ['$http', '$q', 'Prediction', 'LocalStorageWrapperService',
    function($http, $q, Prediction, LocalStorageWrapperService) {

        var predictionService = {

            getThisWeekPredictions: function(userId, week) {

                return predictionsPromise = $http.get('/api/get/prediction/for-user/' + userId + '/week/' + week)
                    .then(function(response) {
                        if (response.data) {

                            var predictionsArray = [];

                            angular.forEach(response.data, function(value, key) {

                                var prediction = new Prediction(value.game, value.homePrediction, value.awayPrediction, value.joker);
                                predictionsArray[prediction.game] = prediction;
                            });

                            return predictionsArray;

                        } else {
                            return $q.reject;
                        }
                    });
            },

            getPredictionsBeforeDate: function(username, date) {

                var userPredictionsBeforeDate = LocalStorageWrapperService.get('getPredictionsBeforeDate:' + username);

                if (userPredictionsBeforeDate) {

                    var deferred = $q.defer();

                    var predictionsArray = [];
                    angular.forEach(userPredictionsBeforeDate, function(value, key) {

                        var prediction = new Prediction(value.game, value.homePrediction, value.awayPrediction, value.joker);
                        predictionsArray[prediction.game] = prediction;
                    });
                    deferred.resolve(predictionsArray);

                    return deferred.promise;

                } else {

                    return $http.get('/api/get/prediction/for-user/' + username + '/before-date/' + date)
                        .then(function(response) {
                            if (response.data) {
                                
                                LocalStorageWrapperService.set('getPredictionsBeforeDate:' + username, response.data, 30);

                                var predictionsArray = [];
                                angular.forEach(response.data, function(value, key) {
                                    var prediction = new Prediction(value.game, value.homePrediction, value.awayPrediction, value.joker);
                                    predictionsArray[prediction.game] = prediction;
                                });
                                return predictionsArray;

                            } else {
                                return $q.reject;
                            }
                        });
                }
            },

            setPredictionForGame: function(userId, game) {

                return predictionsSuccessPromise = $http.post('/api/post/prediction', {
                    "user": userId,
                    "game": game.id,
                    "homePrediction": game.prediction.homePrediction,
                    "awayPrediction": game.prediction.awayPrediction,
                    "joker": game.prediction.joker
                }).then(function(response) {
                    if (response.data) {
                        return response.data;
                    } else {
                        return $q.reject;
                    }
                });

            }

        }

        return predictionService;

    }
]);
