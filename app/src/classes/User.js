NflPredictionsApp.factory('User', function() {

    // instantiate our initial object
    var User = function(fullName, username) {
    	this.fullName = fullName,
    	this.username = username,
    	this.predictions = new Array
    };

    User.prototype.addPrediction = function(prediction) {
    	this.predictions.push(prediction);
    }

    return User;
});
