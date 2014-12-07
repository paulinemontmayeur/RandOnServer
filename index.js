/**
 * Global variables
 */
utils = require('./utils/utils.js')

/**
 * Local variables
 */
var express = require('express');
var database = require('./database/database.js')
var bodyParser = require('body-parser')
var session = require('express-session');
var cookieParser = require('cookie-parser');
var app = express();

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

/**+
 * Restrict function. Check if the user is log in.
 * @param req
 * @param res
 * @param next
 */
function restrict(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        utils.httpResponse(res,403,'Access denied !')
    }
}

/**
 * Default GET route
 */
app.get('/', function(request, response) {
    send("Welcome to Rand'On first page (After some commit)")
})

/**
 * Login an user
 */
app.post('/user/login', function(request, response) {
    database.loginUser(request,response);
})

/**
 * Register an user
 */
app.post('/user/register', function(request, response) {
    database.registerUser(request,response);
})

/**
 * Logout an user
 */
app.post('/user/logout',restrict, function(request, response) {
    database.logoutUser(request,response);
})

/**
 * Create a hike
 */
app.post('/hike/create',restrict, function(request, response) {
    database.createHike(request,response)
})

/**
 * Get public hikes overview
 */
app.post('/hike/overview',restrict, function(request, response) {
    database.hikeOverview(request,response)
})

/**
 * Get specific hike
 */
app.post('/hike/specific',restrict, function(request, response) {
    database.specificHike(request,response)
})

/**
 * Delete an hike
 */
app.post('/hike/remove',restrict, function(request, response) {
    database.deleteHike(request,response)
})