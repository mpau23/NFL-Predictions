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

    app.post('/api/post/user', function(req, res) {

        winston.info("Saving user " + req.body.username);

        User.findById(req.body.id, function(err, user) {

            if (err) {
                res.send(err);
            } else {

                if (user) {
                    res.send(err);
                } else {

                    winston.info(req.body);

                    var user = new User({
                        _id: req.body.id,
                        fullName: req.body.fullName,
                        email: req.body.email,
                        username: req.body.username
                    });
                    user.save(function(err) {
                        if (err) {
                            return res.send(err);
                        } else {
                            return res.send(user);
                        }

                    });
                }
            }
        });

    });}
