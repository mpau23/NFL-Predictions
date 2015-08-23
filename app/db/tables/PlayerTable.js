// grab the mongoose module
var mongoose = require('mongoose');

// define our table
// module.exports allows us to pass this to other files when it is called

var Schema = mongoose.Schema;

var PlayerSchema = new Schema({
    name: String
});

module.exports = mongoose.model('Player', PlayerSchema);
