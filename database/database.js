/**
 * Created by thomasthiebaud on 25/11/14.
 */
var mongoose = require('mongoose')
var Entities = require('html-entities').AllHtmlEntities;


var userSchema = mongoose.Schema({
    userName		: String,
    password		: String,
    emailAddress	: String,
    hikes           : [{
            type: mongoose.Schema.Types.ObjectId, ref: 'Hike'
        }]
});

var hikeSchema = mongoose.Schema({
    name            : String,
    owner           : {
            type: mongoose.Schema.Types.ObjectId, ref: 'User'
        },
    coordinates     : [{
            lat: Number,
            long: Number
        }]
});

var uri =
    process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/Randon';

var port = process.env.PORT || 5000;

mongoose.connect(uri, function (err, res) {
    if (err) {
        console.log ('ERROR connecting to: ' + uri + '. ' + err);
    } else {
        console.log ('Succeeded connected to: ' + uri);
    }
});

var User = mongoose.model('User', userSchema);
var Hike = mongoose.model('Hike', hikeSchema);

module.exports.registerUser = function(request,response) {
    // Select all HTML entities
    var entities = new Entities();
    var user = {
        username : request.body.username,
        password : request.body.password,
        email : request.body.email
    }

    // Analyse encode result
    if((entities.encode(user.username).indexOf('&') > -1 || entities.encode(user.password).indexOf('&') > -1 || entities.encode(user.email).indexOf('&') > -1)) {
        console.log('Bad character used !');
        response.status(500).send({ description: 'Bad character used'});
    }
    else {
        User.find({userName : user.username}, function(err, obj) {
            if (obj.length > 0) {
                console.log('User already exists');
                response.status(403).send({ description: 'User already exists' });
            }
            else {
                var tmpUser = new User ({
                    userName: user.username,
                    password: user.password,
                    emailAddress: user.email
                });

                tmpUser.save(function (err) {
                    if (err) {
                        console.log('Error on save!')
                        response.status(500).send({ description: 'Error on save' });
                    }
                    else {
                        response.status(201).send({ description: 'User successfully created' });
                    }
                });
            }
        });
    }
}

module.exports.loginUser = function(request,response) {
    var user = {
        username : request.body.username,
        password : request.body.password,
        email : request.body.email
    }

    User.find({userName : user.username ,password : user.password}, function(err, obj) {
        if (obj.length > 0) {
            console.log('User found');

            request.session.userId = obj[0]._id;

            response.status(200).send({ description: 'User found' });
        }
        else {
            console.log('User not found')
            response.status(500).send({ description: 'User not found' });
        }
    });
}

module.exports.logoutUser = function(request,response) {
    request.session.destroy(function(){
        response.status(200).send({ description: 'Successfully logout' });
    });
}

module.exports.createHike = function(request,response) {
    var tmpHike = new Hike ({
        name: request.body.name,
        coordinates: request.body.coordinates,
        owner: request.session.userId
    });

    tmpHike.save(function (err,hike) {
        if (err) {
            console.log('Error on save!')
            response.status(500).send({ description: 'Error on save' });
        }
        else {
            User.findById(request.session.userId, function(err,owner) {
                owner.hikes.push(hike._id)
                owner.save()
            })
            response.status(201).send({ description: 'Hike successfully created' });
        }
    });
}