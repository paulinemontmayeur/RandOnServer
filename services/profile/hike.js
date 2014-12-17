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
    User.findOne({token: request.session.userToken}, function (err, owner) {
        if (owner) {
            Hike.findOne({_id: mongoose.Types.ObjectId(request.body.hikeId), owner: owner._id}, function (err, hike) {
                if (hike) {
                    obj.isPrivate = request.body.isPrivate
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