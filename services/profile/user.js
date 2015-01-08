/**
 * Created by thomasthiebaud on 17/12/14.
 */

var User = require(__base + 'services/database/model.js').User
var uuid = require('node-uuid')
var utils = require(__base + 'services/utils/utils.js')
var validator = require(__base + 'services/database/validator.js')

/**
 * Create a new user and log this user in
 * @param request
 * @param response
 */
module.exports.registerUser = function(request,response) {
    
    var user = {
        username    : request.body.username,
        password    : request.body.password,
        email       : request.body.email
    }

    User.find({username : user.username}, function(err, obj) {
        if (obj.length > 0) {
            utils.httpResponse(response,403,'User already exists')
        }
        else {
            var tmpUser = new User ({
                username : user.username,
                password : user.password,
                email : user.email
            });
            tmpUser.save(function (err) {
                if (err)
                    utils.httpResponse(response,500,err)
                else
                    loginUser(tmpUser,request,response)

            });
        }
    });
}

/**
 * Log in the user and add its id into the session
 * @param request
 * @param response
 */
module.exports.loginUser = function(request,response) {
    var user = {
        username : request.body.username,
        password : request.body.password
    }

    loginUser(user,request,response)
}

/**
 * Log in the user and ad   d it into the session
 * @param user User to log in
 * @param request
 * @param response
 */
function loginUser(user,request,response) {
    User.findOne({username : user.username ,password : user.password}, function(err, obj) {
        if (obj) {
            obj.token = uuid.v4()
            request.session.userToken = obj.token;
            obj.save()
            utils.httpResponse(response,200,'User successfully (created and) logged in')
        }
        else {
            utils.httpResponse(response,500,'Impossible to log in the user, user not found')
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