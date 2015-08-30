NflPredictionsApp.factory('Prediction', function() {

    // instantiate our initial object
    var Prediction = function(homePrediction, awayPrediction, joker) {
        this.homePrediction = homePrediction;
        this.awayPrediction = awayPrediction;
        this.joker = joker;
    };

    return Prediction;
});
