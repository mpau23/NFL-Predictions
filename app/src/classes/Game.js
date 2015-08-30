NflPredictionsApp.factory('Game', function() {

    // instantiate our initial object
    var Game = function(id, week, date, awayTeam, homeTeam, prediction) {
        this.id = id;
        this.week = week;
        this.date = date;
        this.awayTeam = awayTeam;
        this.homeTeam = homeTeam;
        this.prediction = prediction;
    };

    return Game;
});
