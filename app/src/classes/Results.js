NflPredictionsApp.factory('Results', function() {

    // instantiate our initial object
    var Results = function(id, week, awayScore, homeScore) {
        this.id = id;
        this.week = week;
        this.users = new Array();
        this.awayScore = awayScore;
        this.homeScore = homeScore;
    };

    Results.prototype.addUser = function(user) {
        this.users.push(user);
    }

    return Results;
});
