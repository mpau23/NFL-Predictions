NflPredictionsApp.factory('Game', function() {

    // instantiate our initial object
    var Game = function(id, week, date, awayTeamId, homeTeamId) {
        this.id = id;
        this.week = week;
        this.date = date;
        this.awayTeamId = awayTeamId;
        this.homeTeamId = homeTeamId;

    };

    Game.prototype.getId = function() {
        return this.id;
    };

    Game.prototype.getWeek = function() {
        return this.week;
    };

    Game.prototype.getDate = function() {
        return this.date;
    };

    Game.prototype.getAwayTeamId = function() {
        return this.awayTeamId;
    };

    Game.prototype.getHomeTeamId = function() {
        return this.homeTeamId;
    };

    return Game;
});
