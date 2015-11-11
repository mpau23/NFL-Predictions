NflPredictionsApp.factory('Game', ['Prediction', function(Prediction) {

    // instantiate our initial object
    var Game = function(id, week, date, awayTeam, homeTeam) {
        this.id = id;
        this.week = week;
        this.date = date;
        this.awayTeam = awayTeam;
        this.homeTeam = homeTeam;

        this.prediction = new Prediction();
        this.awayScore = null;
        this.homeScore = null;
        this.started = false;
        this.points = 0;
    };

    return Game;
}]);
