var express = require('express');
var database = require('./database/database.js')
var bodyParser = require('body-parser')
var session = require('express-session');
var cookieParser = require('cookie-parser');

var app = express();
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
        console.log('Access denied!');
        res.status(403).send({ description: 'Access denied' });
    }
}

/**
 * Default route
 */
app.get('/', function(request, response) {
  response.send("Welcome to Rand'On first page (After some commit)")
})

/**
 * Login an user
 */
app.post('/login', function(request, response) {
    database.loginUser(request,response);
})

/**
 * Register an user
 */
app.post('/register', function(request, response) {
    database.registerUser(request,response);
})

/**
 * Logout an user
 */
app.post('/logout',restrict, function(request, response) {
    database.logoutUser(request,response);
})

/**
 * Create a hike
 */
app.post('/create',restrict, function(request, response) {
    database.createHike(request,response)
})

