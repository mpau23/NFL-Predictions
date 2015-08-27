NflPredictionsApp.factory('User', function() {

    // instantiate our initial object
    var User = function(fullName, email, username, token) {
    	this.fullName = fullName,
    	this.email = email,
    	this.username = username,
    	this.token = token
    };

    return User;
});
