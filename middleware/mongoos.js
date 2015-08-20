// set requirments.
var mongoose = require('mongoose');
var fs = require('fs');

// if connect is successful
mongoose.connection.on('connected', function (ref) {
    console.log('Connected to ' + GLOBAL.conf.mongo_db_environment + ' DB!');
});

// If the connection throws an error
mongoose.connection.on("error", function (err) {
    console.error('Failed to connect to DB ' + GLOBAL.conf.mongo_db_environment + ' on startup ', err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection to DB :' + GLOBAL.conf.mongo_db_environment + ' disconnected');
});

// close mongo connection.
var gracefulExit = function () {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection with DB :' + GLOBAL.conf.mongo_db_environment + ' is disconnected through app termination');
        process.exit(0);
    });
}

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

var options = {
    server: {
        auto_reconnect: true,
        socketOptions : {
            keepAlive: 1
        }
    }
};

// connect to db.
mongoose.connect(GLOBAL.conf.dbconfig.mongo.url, options);


//load all files in models dir = load schemas
fs.readdirSync(__dirname.replace('middleware', 'models/')).forEach(function (filename) {
    if (~filename.indexOf('.js')) require(__dirname.replace('middleware', 'models/') + filename)
});