NflPredictionsApp.factory('User', function() {

    // instantiate our initial object
    var User = function(fullName, username) {
    	this.fullName = fullName,
    	this.username = username,
    	this.predictions = new Array,
        this.points = 0
    };

    User.prototype.addPrediction = function(prediction) {
    	this.predictions.push(prediction);
    }

    User.prototype.addPoints = function(points) {
        this.points += points;
    }

    return User;
});
