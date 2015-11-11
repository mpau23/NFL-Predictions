var User = require('../tables/UserTable');
var winston = require('winston');

module.exports = function(app) {

    app.get('/api/get/user/by-login/:user', function(req, res) {

        winston.info("Requesting log in");

        User.findById(req.params.user, function(err, user) {

            if (err) {
                res.send(err);
            } else {
                res.json(user);
            }

        });
    });

    app.get('/api/get/user/all', function(req, res) {

    	winston.info("Requesting all users");

        User.find({}, '-_id fullName username', function(err, user) {

            if (err) {
                res.send(err);
            } else {
                res.json(user);
            }
        });
    });
}
