 // app/routes.js

 // grab the nerd model we just created
 var Player = require('./db/tables/Player');
 var Game = require('./db/tables/Game');
 var Team = require('./db/tables/Team');
 var Prediction = require('./db/tables/Prediction');

 module.exports = function(app) {

     // server routes ===========================================================
     // handle things like api calls
     // authentication routes

     // sample api route
     app.get('/api/player', function(req, res) {
         // use mongoose to get all nerds in the database

        console.log("im here");

         Player.find(function(err, player) {

             // if there is an error retrieving, send the error. 
             // nothing after res.send(err) will execute
             if (err)
                 res.send(err);

             res.json(player); // return all players in JSON format
         });
     });


     app.post('/api/player', function(req, res) {
         
         console.log("im in");

         var player;

         player = new Player({
             name: req.body.name
         });

         player.save(function(err) {
             if (!err) {
                 return console.log("created");
             } else {
                 return console.log(err);
             }
         });

         return res.send(player);
     });

     // route to handle creating goes here (app.post)
     // route to handle deletes goes here (app.delete)

     // frontend routes =========================================================
     // route to handle all angular requests
     app.get('*', function(req, res) {
         res.sendFile(__dirname + '/public/index.html'); // load our public/index.html file
     });

 };
