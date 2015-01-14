/**
 * Created by thomasthiebaud on 17/12/14.
 */

var User = require(__base + 'services/database/model.js').User
var Hike = require(__base + 'services/database/model.js').Hike

var mongoose = require(__base + 'services/database/database.js').mongoose
var utils = require(__base + 'services/utils/utils.js')

/**
 * Create a hike and add it to the user's hikes list
 * @param request
 * @param response
 */
module.exports.createHike = function(request,response) {

    User.findOne({token : request.session.userToken}, function(err,owner) {
        var tmpHike = new Hike ({
            name                : request.body.name,
            length              : request.body.length,
            duration            : request.body.duration,
            date                : request.body.date,
            coordinates         : request.body.coordinates,
            owner               : owner._id,
            isPrivate           : request.body.isPrivate,
            positiveHeightDiff  : request.body.positiveHeightDiff,
            negativeHeightDiff  : request.body.negativeHeightDiff,
            averageSpeed        : request.body.averageSpeed
        });

        tmpHike.save(function (err,hike) {
            if (err) {
                utils.httpResponse(response,500,err)
            }
            else {
                owner.hikes.push(hike._id)
                owner.history.push(hike._id)
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
    User.findOne({token : request.session.userToken}, function(err, user) {
        if (user) {
            Hike.find({$or:[{isPrivate : false},{isPrivate : true, owner: user._id}]},'-coordinates', function(err, hikes) {
                if (hikes) {
                    utils.httpResponse(response,200,'Hikes successfully found',hikes)
                }
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
    Hike.findById(mongoose.Types.ObjectId(request.query.hikeId), function(err, obj) {
        if (obj)
            utils.httpResponse(response,200,'Hike successfully found',obj)
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
module.exports.visibility = function(request,response) {
    User.findOne({token: request.session.userToken}, function (err, owner) {
        if (owner) {
            Hike.findOne({_id: mongoose.Types.ObjectId(request.body.hikeId), owner: owner._id}, function (err, hike) {
                if (hike) {
                    hike.isPrivate = request.body.isPrivate
                    hike.save()
                    utils.httpResponse(response, 200, 'Hike\'s visibility successfully changed')
                }
                else
                    utils.httpResponse(response, 500, 'Hike not found')
            })
        }
        else {
            utils.httpResponse(response, 500, 'Impossible to change hike\'s visibility, server is not able to check if you are the owner')
        }
    })
}

/**
 * Checks if the given name exists
 * @param request
 * @param response
 */
module.exports.exists = function(request,response) {
    Hike.findOne({name : request.query.name}, function(err,hike) {
        if(hike)
            utils.httpResponse(response,200,'Name already used',true)
        else
            utils.httpResponse(response,200,'Free name',false)
    })
}

/**
 * Get all hikes sorted by proximity with the user. The result does not include all the coordinates but just the start point
 * @param request
 * @param response
 */
module.exports.proximity = function(request,response) {
    User.findOne({token : request.session.userToken}, function(err, user) {
        if (user) {
            Hike.find({$or:[{isPrivate : false},{isPrivate : true, owner: user._id}]},{coordinates : {$slice : 1}}, function(err, hikes) {
                hikes.sort(function(x, y){
                    return utils.distance(x.coordinates[0].lat, x.coordinates[0].long,request.query.lat,request.query.long) - utils.distance(y.coordinates[0].lat, y.coordinates[0].long,request.query.lat,request.query.long)
                });

                if (hikes) {
                    utils.httpResponse(response,200,'Hikes successfully found',hikes)
                }
                else
                    utils.httpResponse(response,500,'Hikes not found')
            });
        }
    })
}