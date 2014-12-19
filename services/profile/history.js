/**
 * Created by thomasthiebaud on 18/12/14.
 */

var User = require(__base + 'services/database/model.js').User
var Hike = require(__base + 'services/database/model.js').Hike

var utils = require(__base + 'services/utils/utils.js')

/**
 * Add an hike into the history
 * @param request
 * @param response
 */
module.exports.add = function(request,response) {
    User.findOne({token : request.session.userToken}, function(err,owner) {
        if(owner) {
            var index = owner.history.indexOf(request.body.hikeId);
            if (index > -1)
                utils.httpResponse(response,500,'Hike already in history')
            else {
                owner.history.push(request.body.hikeId)
                owner.save(function(err) {
                    if(err)
                        utils.httpResponse(response,500,'Error on save')
                    else
                        utils.httpResponse(response,200,'Hike successfully added into the history')
                })
            }
        }
        else {
            utils.httpResponse(response,500,'Impossible to add the hike to the history, server is not able to check your identity')
        }
    })
}

/**
 * Remove an hike from the history
 * @param request
 * @param response
 */
module.exports.remove = function(request,response) {
    User.findOne({token : request.session.userToken}, function(err,owner) {
        if(owner) {
            var index = owner.history.indexOf(request.body.hikeId);
            if (index > -1) {
                owner.history.splice(index, 1);
                owner.save(function(err) {
                    if(err)
                        utils.httpResponse(response,500,'Error on save')
                    else
                        utils.httpResponse(response,200,'Hike successfully removed from the history')
                })
            }
            else
                utils.httpResponse(response,500,'Hike not in the history')

        }
        else {
            utils.httpResponse(response,500,'Impossible to remove the hike from the history, server is not able to check your identity')
        }
    })
}

/**
 * Get all the hikes from the history. This does not include coordinates
 * @param request
 * @param response
 */
module.exports.overview = function(request,response) {
    User.findOne({token : request.session.userToken}, function(err, user) {
        if (user) {
            Hike.find({_id : {$in : user.history}},'name', function(err, history) {
                if (err)
                    utils.httpResponse(response,500,'Impossible to get the history')
                else
                    utils.httpResponse(response,200,'Hikes successfully found',history)
            });
        }
    })
}