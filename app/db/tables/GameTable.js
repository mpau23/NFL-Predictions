// grab the mongoose module
var mongoose = require('mongoose');

// define our table
// module.exports allows us to pass this to other files when it is called

var Schema = mongoose.Schema;

var GameSchema = new Schema({
    _id: Number,
    week: Number,
    homeTeam: {
        type: String,
        ref: 'Team'
    },
    awayTeam: {
        type: String,
        ref: 'Team'
    },
    date: Date

});

module.exports = mongoose.model('Game', GameSchema);
