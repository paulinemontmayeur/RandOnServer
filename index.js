var express = require('express');
var database = require('./database/database.js')
var bodyParser = require('body-parser')
var session = require('express-session');
var cookieParser = require('cookie-parser');

var app = express();
app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
    .use(bodyParser.urlencoded())
    .use(cookieParser())
    .use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true
    }));

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
})

function restrict(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        console.log('Access denied!');
        res.status(403).send({ description: 'Access denied' });
    }
}

app.get('/', function(request, response) {
  response.send("Welcome to Rand'On first page (After some commit)")
})

app.post('/login', function(request, response) {
    console.log('Name : ' + request.body.username);
    console.log('Password : ' + request.body.password);
    console.log('Email : ' + request.body.email);

    var user = {
        username : request.body.username,
        password : request.body.password,
        email : request.body.email
    }

    database.loginUser(user,request,response);
})

app.post('/register', function(request, response) {
    console.log('Name : ' + request.body.username);
    console.log('Password : ' + request.body.password);
    console.log('Email : ' + request.body.email);

    var user = {
        username : request.body.username,
        password : request.body.password,
        email : request.body.email
    }

    database.registerUser(user,response);
})

app.post('/logout',restrict, function(request, response) {
    request.session.destroy(function(){
        response.status(200).send({ description: 'Successfully logout' });
    });
})

