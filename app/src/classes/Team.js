NflPredictionsApp.factory('Team', function() {

    // instantiate our initial object
    var Team = function(code, name) {
        this.id = code;
        this.displayName = name;
    };

    Team.prototype.id = function() {
        return this.id;
    };

    Team.prototype.displayName = function() {
        return this.displayName;
    };

    return Team;
});