NflPredictionsApp.factory('Team', function() {

    // instantiate our initial object
    var Team = function(code, shortName, fullName) {
        this.code = code;
        this.shortName = shortName;
        this.fullName = fullName;
    };

    return Team;
});