/**
 * Created by thomasthiebaud on 25/11/14.
 */
var mongoose = require('mongoose')
var Entities = require('html-entities').AllHtmlEntities;


var userSchema = mongoose.Schema({
    userName		: String
    , password		: String
    , emailAddress		: String
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

module.exports.registerUser = function(user,response) {
    // Select all HTML entities
    var entities = new Entities();

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

module.exports.loginUser = function(user,request,response) {
    User.find({userName : user.username ,password : user.password}, function(err, obj) {
        if (obj.length > 0) {
            console.log('User found');

            request.session.user = user;

            response.status(200).send({ description: 'User found' });
        }
        else {
            console.log('User not found')
            response.status(500).send({ description: 'User not found' });
        }
    });
}

function findUser(login) {
    var query = User.find({'userName': login});
    query.exec(function(err, result) {
        if (!err) {
            console.log (result)
        } else {
            console.log ('Error')
        }
    });
}



/*
createUser();
findUser('Gabriel');
exists(new PUser ({
    userName: 'Thomas',
    password: '12345',
    emailAddress: 'tom@gmail.com'
}));
*/