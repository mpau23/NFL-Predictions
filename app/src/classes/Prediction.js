NflPredictionsApp.factory('Prediction', function() {

    // instantiate our initial object
    var Prediction = function(game, homePrediction, awayPrediction, joker) {
        this.game = game;

        if (typeof homePrediction === 'undefined') {
            this.homePrediction = 0;
        } else {
            this.homePrediction = homePrediction;
        }

        if (typeof awayPrediction === 'undefined') {
            this.awayPrediction = 0;
        } else {
            this.awayPrediction = awayPrediction;
        }
        
        if (typeof joker === 'undefined') {
            this.joker = false;
        } else {
            this.joker = joker;
        }

        
    };

    return Prediction;
});
