NflPredictionsApp.factory('Prediction', function() {

    // instantiate our initial object
    var Prediction = function(homePrediction, awayPrediction) {
        this.homePrediction = homePrediction;
        this.awayPrediction = awayPrediction;
    };

    return Prediction;
});
