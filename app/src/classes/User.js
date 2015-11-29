NflPredictionsApp.factory('User', function() {

    // instantiate our initial object
    var User = function(fullName, username) {
        this.fullName = fullName,
            this.username = username,
            this.predictions = [],
            this.points = 0,
            this.thisWeekPoints = 0
    };

    User.prototype.addPrediction = function(prediction) {
        this.predictions[prediction.game] = prediction;
    }

    User.prototype.addPoints = function(points) {
        this.points += points;
    }

    User.prototype.addThisWeekPoints = function(thisWeekPoints) {
        this.thisWeekPoints += thisWeekPoints;
    }

    return User;
});
