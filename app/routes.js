 // app/routes.js

 var Player = require('./db/tables/PlayerTable');
 var Game = require('./db/tables/GameTable');
 var Team = require('./db/tables/TeamTable');
 var Prediction = require('./db/tables/PredictionTable');

 module.exports = function(app) {

     //GET Requests

     app.get('/api/player', function(req, res) {

         Player.find(function(err, player) {

             if (err)
                 res.send(err);

             res.json(player);
         });
     });

     app.get('/api/team', function(req, res) {

         Team.find(function(err, team) {

             if (err)
                 res.send(err);

             res.json(team);
         });
     });

     app.get('/api/team/:code', function(req, res) {

         Team.findById(req.params.code, function(err, team) {

             if (err)
                 res.send(err);

             res.json(team);
         });
     });

     app.get('/api/game', function(req, res) {

         Game.find({})
             .populate('awayTeam')
             .populate('homeTeam')
             .exec(function(err, game) {
                 if (err)
                     res.send(err);

                 res.json(game);
             });

     });

     //POST Requests

     app.post('/api/player', function(req, res) {

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

     app.post('/api/team', function(req, res) {

         var team;

         team = new Team({
             _id: req.body.code,
             shortName: req.body.shortName,
             fullName: req.body.fullName
         });

         team.save(function(err) {
             if (!err) {
                 return console.log("created");
             } else {
                 return console.log(err);
             }
         });

         return res.send(team);
     });


     app.post('/api/game', function(req, res) {

         var game;

         game = new Game({
             _id: req.body.id,
             week: req.body.week,
             homeTeam: req.body.homeTeam,
             awayTeam: req.body.awayTeam,
             date: req.body.date
         });

         game.save(function(err) {
             if (!err) {
                 return console.log("created");
             } else {
                 return console.log(err);
             }
         });

         return res.send(game);
     });

     app.get('*', function(req, res) {
         res.sendFile(__dirname + '/public/index.html');
     });

 };
