 // app/routes.js

// grab the nerd model we just created
var Player = require('./db/tables/Player');

    module.exports = function(app) {

        // server routes ===========================================================
        // handle things like api calls
        // authentication routes

        // sample api route
        app.get('/api/player', function(req, res) {
            // use mongoose to get all nerds in the database
            Player.find(function(err, player) {

console.log(player);
                // if there is an error retrieving, send the error. 
                                // nothing after res.send(err) will execute
                if (err)
                    res.send(err);

                res.json(player); // return all players in JSON format
            });
        });

        // route to handle creating goes here (app.post)
        // route to handle deletes goes here (app.delete)

        // frontend routes =========================================================
        // route to handle all angular requests
        app.get('*', function(req, res) {
            res.sendFile(__dirname + '/public/index.html'); // load our public/index.html file
        });

    };