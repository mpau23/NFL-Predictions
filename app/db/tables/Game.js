// grab the mongoose module
var mongoose = require('mongoose');

// define our table
// module.exports allows us to pass this to other files when it is called

var Schema = mongoose.Schema;

var GameSchema = new Schema({
    week: Number,
    time: Date,
    homeScore: Number,
    awayScore: Number,
    homeTeam: {
        type: Schema.Types.ObjectId,
        ref: 'Team'
    },
    awayTeam: {
        type: Schema.Types.ObjectId,
        ref: 'Team'
    }
});

module.exports = mongoose.model('Game', PlayerSchema);
