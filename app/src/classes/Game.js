NflPredictionsApp.factory('Game', function() {

    // instantiate our initial object
    var Game = function(id, week, date, awayTeam, homeTeam, prediction, awayScore, homeScore) {
        this.id = id;
        this.week = week;
        this.date = date;
        this.awayTeam = awayTeam;
        this.homeTeam = homeTeam;
        this.prediction = prediction;
        this.awayScore = awayScore;
        this.homeScore = homeScore;
        this.started = false;
    };

    return Game;
});
