NflPredictionsApp.factory('Game', function() {

    // instantiate our initial object
    var Game = function(id, week, date, time, awayTeamId, homeTeamId) {
        this.id = id;
        this.week = week;
        this.date = date;
        this.time = time;
        this.awayTeamId = awayTeamId;
        this.homeTeamId = homeTeamId;

    };

    return Game;
});
