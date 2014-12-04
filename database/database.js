/**
 * Created by thomasthiebaud on 25/11/14.
 */
var mongoose = require('mongoose')
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
    var localUser = user;
    var localResponse = response;
    User.find({userName : user.username ,emailAddress : user.email}, function(err, obj) {
        if (obj.length > 0) {
            console.log('User already exists');
            localResponse.status(403).send({ error: 'User already exists' });
        }
        else {
            var user = new User ({
                userName: localUser.username,
                password: localUser.password,
                emailAddress: localUser.email
            });

            user.save(function (err) {
                if (err) {
                    console.log('Error on save!')
                    localResponse.status(500).send({ error: 'Error on save' });
                }
                else {
                    localResponse.status(201).send({ error: 'User successfully created' });
                }
            });
        }
    });
}

module.exports.loginUser = function(user,response) {
    var localResponse = response;
    User.find({userName : user.username ,emailAddress : user.email}, function(err, obj) {
        if (obj.length > 0) {
            console.log('User found');

            //TODO Create and add user to session

            localResponse.status(200).send({ error: 'User found' });
        }
        else {
            console.log('User not found')
            localResponse.status(500).send({ error: 'User not found' });
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