NflPredictionsApp.factory('Game', function() {

    // instantiate our initial object
    var Game = function(id, week, date, awayTeam, homeTeam) {
        this.id = id;
        this.week = week;
        this.date = date;
        this.awayTeam = awayTeam;
        this.homeTeam = homeTeam;

        this.prediction = null;
        this.awayScore = null;
        this.homeScore = null;
        this.started = false;
        this.points = 0;
    };

    return Game;
});
