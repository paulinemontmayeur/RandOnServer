/**
 * Created by thomasthiebaud on 25/11/14.
 */
var mongoose = require('mongoose')
var Entities = require('html-entities').AllHtmlEntities
var uuid = require('node-uuid')

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
    token           : String,
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

module.exports.User = User
module.exports.Hike = Hike

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
                        //request.session.userId = dbUser._id
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

    User.findOne({userName : user.username ,password : user.password}, function(err, obj) {
        if (obj) {
            obj.token = uuid.v4()
            console.log("token : " + obj.token)
            request.session.userToken = obj.token;
            obj.save()
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

    User.findOne({token : request.session.userToken}, function(err,owner) {
        var tmpHike = new Hike ({
            name: request.body.name,
            coordinates: request.body.coordinates,
            owner: owner._id,
            isPrivate: request.body.isPrivate
        });

        tmpHike.save(function (err,hike) {
            if (err) {
                utils.httpResponse(response,500,'Error on save')
            }
            else {
                owner.hikes.push(hike._id)
                owner.save()
                utils.httpResponse(response,201,'Hike successfully created')
            }
        });
    })

}

/**
 * Get overview of all public hikes and user private hikes. The overview does not include coordinates.
 * @param request
 * @param response
 */
module.exports.hikeOverview = function(request,response) {
    User.findOne({token : request.session.userToken}, function(err, obj) {
        if (obj) {
            Hike.find({$or:[{isPrivate : false},{isPrivate : true, owner: obj._id}]},'-coordinates', function(err, obj) {
                if (obj.length > 0)
                    response.status(200).send({description : 'Hikes successfully found'},{hikes : obj})
                else
                    utils.httpResponse(response,500,'Hikes not found')
            });
        }
    })
}

/**
 * Get a specific hike with all its coordinates
 * @param request
 * @param response
 */
module.exports.specificHike = function(request,response) {
    Hike.findById(mongoose.Types.ObjectId(request.body.hikeId), function(err, obj) {
        if (obj)
            response.status(200).send({description : 'Hike successfully found'},{hike : obj});
        else
            utils.httpResponse(response,500,'Hike not found')
    });
}

/**
 * Delete an hike from the database.
 * @param request
 * @param response
 */
module.exports.deleteHike = function(request,response) {
    User.findOne({token : request.session.userToken}, function(err,owner) {
        if(owner) {
            Hike.remove({_id: mongoose.Types.ObjectId(request.body.hikeId), owner: owner._id}, function(err,hike) {
                if(hike) {
                    var index = owner.hikes.indexOf(request.body.hikeId);
                    if (index > -1)
                        owner.hikes.splice(index, 1);
                    owner.save()
                    utils.httpResponse(response,200,'Hike successfully removed')
                }
                else {
                    utils.httpResponse(response,500,'Hike not found')
                }
            })
        }
        else {
            utils.httpResponse(response,500,'Impossible to delete the hike, server is not able to check if you are the owner')
        }
    })
}

/**
 * Change the hike's visibility
 * @param request
 * @param response
 */
module.exports.hikeVisibility = function(request,response) {
    User.findOne({token : request.session.userToken}, function(err,owner) {
        if(owner) {
            Hike.findOne({_id: mongoose.Types.ObjectId(request.body.hikeId), owner: owner._id}, function(err,hike) {
                if(hike) {
                    obj.isPrivate = request.body.isPrivate
                    utils.httpResponse(response,200,'Hike\'s visibility successfully changed')
                }
                else
                    utils.httpResponse(response,500,'Hike not found')
            })
        }
        else {
            utils.httpResponse(response,500,'Impossible to change hike\'s visibility, server is not able to check if you are the owner')
        }
    })
}