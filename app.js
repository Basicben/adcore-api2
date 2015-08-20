// get configuration file and store it as global variable - GLOBAL.conf .
var config = require('./config/config');
GLOBAL.conf = config;

// set requirments.
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var moongoConnect = require('./middleware/mongoos.js');


// set http server.
var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse

app.set('view engine', 'jade');

// configure allowed http calls.
app.all('/*', function (req, res, next) {
    // CORS headers
    res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

// for all requests containing api req validate jwt.
// app.all('/api/*', [require('./middleware/authValidate')]);

// find routes
app.use('/', require('./routes'));

// error handlers

// development error handler
// will print stacktrace
if (config.sys_environment === 'dev') {
    app.use(function (err, req, res, next) {
        res.json({ error: { message: err.message, code: 404, err: err } });
    });
}

// production error handler
// no stacktraces leaked to user
if (config.sys_environment !== 'dev') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json({ error: { message: err.message, code: 500 } });
    });
}

app.use(function (req, res, next) {
    res.json({ error: { message: 'Not Found', code: 404 } });
});

module.exports = app;

