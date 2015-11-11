var path = require('path');
var express = require('express');

module.exports = function(app) {

    require('./routes/UserRoutes')(app);
    require('./routes/GameRoutes')(app);
    require('./routes/PredictionRoutes')(app);

    app.use(express.static(path.resolve(__dirname + '/../public')));

    app.get('*', function(req, res) {
        res.sendFile(path.resolve(__dirname + '/../public/index.html'));
    });

};
