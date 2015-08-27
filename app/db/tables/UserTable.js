// grab the mongoose module
var mongoose = require('mongoose');

// define our table
// module.exports allows us to pass this to other files when it is called

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    _id: String,
    fullName: String,
    email :String,
    username :String 
});

module.exports = mongoose.model('User', UserSchema);