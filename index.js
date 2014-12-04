var express = require('express');
var app = express();
var database = require('./database/database.js')
var bodyParser = require('body-parser')


app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
    .use(bodyParser.urlencoded());

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
})

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

    database.loginUser(user,response);
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

app.post('/logout', function(request, response) {
    response.status(200).send({ message: 'Successfully logout' });
})

