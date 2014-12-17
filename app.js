/**
 * Global variables
 */
global.__base = __dirname + '/'

/**
 * npm modules
 */
var express = require('express');
var bodyParser = require('body-parser')
var session = require('express-session');
var cookieParser = require('cookie-parser');
var app = express();

/**
 * Export variables
 */
module.exports.app = app

/**
 * Express configuration
 */
app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
    .use(bodyParser.json())
    .use(cookieParser())
    .use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true
    }));

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
})

/**
 * Local modules
 */
var route = require('./services/route/routes.js')