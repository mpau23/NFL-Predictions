NflPredictionsApp.factory('ScoreService', [function() {

    var scoreService = {

        calculatePoints: function(awayScore, homeScore, awayPrediction, homePrediction, joker) {

            var correctPoints = false;
            var correctTeam = false;
            var correctExactScore = false;
            var points = 0;

            if ((awayScore + homeScore) == (awayPrediction + homePrediction)) {
                correctPoints = true;
            }

            if (awayScore < homeScore && awayPrediction < homePrediction) {
                correctTeam = true;
            }

            if (awayScore > homeScore && awayPrediction > homePrediction) {
                correctTeam = true;
            }

            if (awayScore == homeScore && awayPrediction == homePrediction) {
                correctTeam = true;
            }

            if (awayScore == awayPrediction && homeScore == homePrediction) {
                correctExactScore = true;
            }

            if (correctPoints) {
                points += 5;
            }

            if (correctTeam) {
                points += 10;
            }

            if (correctExactScore) {
                points += 15;
            }

            if (joker) {
                points *= 2;
            }

            return points;
        }
    }

    return scoreService;

}]);
