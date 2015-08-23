// grab the mongoose module
var mongoose = require('mongoose');

// define our table
// module.exports allows us to pass this to other files when it is called

var Schema = mongoose.Schema;

var PredictionSchema = new Schema({
    game: {
        type: Schema.Types.ObjectId,
        ref: 'Game'
    },
    player: {
        type: Schema.Types.ObjectId,
        ref: 'Player'
    },
    homePrediction: Number,
    awayPrediction: Number
});

module.exports = mongoose.model('Prediction', PredictionSchema);
