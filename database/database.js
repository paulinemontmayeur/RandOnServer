/**
 * Created by thomasthiebaud on 25/11/14.
 */

var mongoose = require('mongoose')
var Entities = require('html-entities').AllHtmlEntities

var uri =
    process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/Randon';

var port = process.env.PORT || 5000

mongoose.connect(uri, function (err, res) {
    if (err)
        console.log ('ERROR connecting to: ' + uri + '. ' + err)
    else
        console.log ('Succeeded connected to: ' + uri)
})

/**
 * MongoDB schema
 */
var userSchema = mongoose.Schema({
    userName		: String,
    password		: String,
    emailAddress	: String,
    hikes           : [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Hike'
    }],
    history           : [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Hike'
    }]
})

var hikeSchema = mongoose.Schema({
    name            : String,
    isPrivate       : Boolean,
    owner           : {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    coordinates     : [{
        lat: Number,
        long: Number
    }]
})

var User = mongoose.model('User', userSchema)
var Hike = mongoose.model('Hike', hikeSchema)

/**
 * Create a new user and log this user in
 * @param request
 * @param response
 */
module.exports.registerUser = function(request,response) {
    // Select all HTML entities
    var entities = new Entities();
    var user = {
        username : request.body.username,
        password : request.body.password,
        email : request.body.email
    }

    // Analyse encoded result
    if((entities.encode(user.username).indexOf('&') > -1 || entities.encode(user.password).indexOf('&') > -1 || entities.encode(user.email).indexOf('&') > -1)) {
        utils.httpResponse(response,500,'Bad character used')
    }
    else {
        User.find({userName : user.username}, function(err, obj) {
            if (obj.length > 0) {
                utils.httpResponse(response,403,'User already exists')
            }
            else {
                var tmpUser = new User ({
                    userName: user.username,
                    password: user.password,
                    emailAddress: user.email
                });

                tmpUser.save(function (err,dbUser) {
                    if (err) {
                        console.log('Error on save!')
                        utils.httpResponse(response,500,'Error on save')
                    }
                    else {
                        request.session.userId = dbUser._id
                        utils.httpResponse(response,201,'User successfully created')
                    }
                });
            }
        });
    }
}

/**
 * Log in the user and add its id into the session
 * @param request
 * @param response
 */
module.exports.loginUser = function(request,response) {
    var user = {
        username : request.body.username,
        password : request.body.password,
    }

    User.find({userName : user.username ,password : user.password}, function(err, obj) {
        if (obj.length > 0) {
            request.session.userId = obj[0]._id;
            utils.httpResponse(response,200,'User found')
        }
        else {
            utils.httpResponse(response,500,'User not found')
        }
    });
}

/**
 * Log out the user by destroying the session
 * @param request
 * @param response
 */
module.exports.logoutUser = function(request,response) {
    request.session.destroy(function(){
        utils.httpResponse(response,200,'Successfully logout')
    });
}

/**
 * Create a hike and add it to the user's hikes list
 * @param request
 * @param response
 */
module.exports.createHike = function(request,response) {
    var tmpHike = new Hike ({
        name: request.body.name,
        coordinates: request.body.coordinates,
        owner: request.session.userId,
        isPrivate: request.body.isPrivate
    });

    tmpHike.save(function (err,hike) {
        if (err) {
            utils.httpResponse(response,500,'Error on save')
        }
        else {
            User.findById(request.session.userId, function(err,owner) {
                owner.hikes.push(hike._id)
                owner.save()
            })
            utils.httpResponse(response,201,'Hike successfully created')
        }
    });
}

/**
 * Get overview of all public hikes and user private hikes. The overview does not include coordinates.
 * @param request
 * @param response
 */
module.exports.hikeOverview = function(request,response) {
    Hike.find({$or:[{isPrivate : false},{isPrivate : true, owner: request.session.userId}]},'-coordinates', function(err, obj) {
        if (obj.length > 0) {
            response.status(200).send({description : 'Hikes successfully found'},{hikes : obj});
        }
        else {
            utils.httpResponse(response,500,'Hikes not found')
        }
    });
}

/**
 * Get a specific hike with all its coordinates
 * @param request
 * @param response
 */
module.exports.specificHike = function(request,response) {
    Hike.findById(mongoose.Types.ObjectId(request.body.hikeId), function(err, obj) {
        if (obj) {
            response.status(200).send({description : 'Hike successfully found'},{hike : obj});
        }
        else {
            utils.httpResponse(response,500,'Hike not found')
        }
    });
}