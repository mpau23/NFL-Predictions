 // app/routes.js

 var User = require('./db/tables/UserTable');
 var Game = require('./db/tables/GameTable');
 var Team = require('./db/tables/TeamTable');
 var Prediction = require('./db/tables/PredictionTable');
 var Base64 = require('./db/services/Base64');

 module.exports = function(app) {

     //GET Requests

     app.get('/api/user/:username/:password', function(req, res) {

         var userToken = Base64.encode(req.params.username + ':' + req.params.password)
         User.findById(userToken, function(err, user) {

             if (err)
                 res.send(err);

             res.json(user);
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

     app.get('/api/game/:week', function(req, res) {

         Game.find({
                 week: req.params.week
             })
             .populate('awayTeam')
             .populate('homeTeam')
             .exec(function(err, game) {
                 if (err)
                     res.send(err);

                 res.json(game);
             });

     });

     //POST Requests

     app.post('/api/user', function(req, res) {

         var user;

         user = new User({
             _id: Base64.encode(req.body.username + ':' + req.body.password),
             fullName: req.body.fullName,
             email: req.body.email,
             username: req.body.username
         });

         user.save(function(err) {
             if (!err) {
                 return res.send(err);
             }
         });
         console.log(user);
         return res.json(user);
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
        console.log(req.headers);
         res.sendFile(__dirname + '/public/index.html');
     });

 };
