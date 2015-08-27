// grab the mongoose module
var mongoose = require('mongoose');

// define our table
// module.exports allows us to pass this to other files when it is called

var Schema = mongoose.Schema;

var PredictionSchema = new Schema({
    game: {
        type: Number,
        ref: 'Game'
    },
    user: {
        type: String,
        ref: 'User'
    },
    homePrediction: Number,
    awayPrediction: Number
});

module.exports = mongoose.model('Prediction', PredictionSchema);
