// grab the mongoose module
var mongoose = require('mongoose');

// define our table
// module.exports allows us to pass this to other files when it is called

var Schema = mongoose.Schema;

var TeamSchema = new Schema({
    _id: String,
    shortName: String,
    fullName: String,
    games: {
        type: Schema.Types.ObjectId,
        ref: 'Game'
    }
});

module.exports = mongoose.model('Team', TeamSchema);