/**
 * Created by jordi on 31/07/17.
 */
/*
 https://www.ibm.com/developerworks/community/blogs/c1b14989-1f61-4411-a56c-abcde2481218/entry/How_to_Make_a_resilient_connection_between_Node_js_and_MongoDB_using_Mongoose_in_Bluemix?lang=en
 http://theholmesoffice.com/mongoose-connection-best-practice/
 */

/**********************************************************************************************************************/
// load mongoose package
var config = require('../config/config');
var mongoose = require('mongoose');
// Use native Node promises
mongoose.Promise = global.Promise;

// connect to MongoDB and create/use database
// Mongoose will never stops trying to reconnect: reconnectTries: Number.MAX_VALUE
var mongooseOptions = {
    server : {
        auto_reconnect:true,
        reconnectTries: Number.MAX_VALUE,
        socketOptions: { keepAlive: 1, connectTimeoutMS: config.db.ConnectTimeoutMS }
    }
};

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + config.db.URI);
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
    console.log('Mongoose default connection error: ' + err);
    mongoose.disconnect();
});

mongoose.connection.on('reconnected', function () {
    console.log('Mongoose default connection reconnected');
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
//  mongoose.connect(config.db.URI, {server:{auto_reconnect:true, socketOptions: { keepAlive: 1, connectTimeoutMS: config.db.ConnectTimeoutMS }}, replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : config.db.ConnectTimeoutMS } }});
    //process.exit(0);
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

//mongoose.connect(config.db, options).then(() =>  console.log('database connection successful')).catch((err) => console.error(err));
//mongoose.connect(config.db.URI, {server : { auto_reconnect : true } });
//mongoose.connect(config.db.URI, mongooseOptions);

//var connectWithRetry = function() {
//  return mongoose.connect(config.db.URI, function(err) {
//    if (err) {
//      console.error('Failed to connect to Mongo on startup - retrying in 5 sec', err);
//      setTimeout(connectWithRetry, 5000);
//    }
//  });
//};
//connectWithRetry();

module.exports.connect = function() {
    return mongoose.connect(config.db.URI, mongooseOptions);
};

module.exports.reconnect = function() {
    //Attention: The database can be disconnect but mongoose can try to reconnect, don't use if auto_reconnect = true
    if (mongoose.connection.readyState !==  mongoose.Connection.STATES.connected) {
        return mongoose.connect(config.db.URI, mongooseOptions);
    }
};

module.exports.isConnected = function() {
    return mongoose.connection.readyState ===  mongoose.Connection.STATES.connected;
};

module.exports.isNotConnected = function() {
    return mongoose.connection.readyState !==  mongoose.Connection.STATES.connected;
};


/**********************************************************************************************************************/
