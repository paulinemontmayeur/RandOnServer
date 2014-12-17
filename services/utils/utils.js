/**
 * Created by thomasthiebaud on 06/12/14.
 */

var User = require(__base + 'services/database/model.js').User


/**
 * Return http response. Print message in console.
 * @param response
 * @param code Http status code
 * @param description Description of the response
 */
function httpResponse(response,code,description) {
    var s

    if(/^1\d+/.test(code))
        s = '[INFORMATION] '
    if(/^2\d+/.test(code))
        s = '[SUCCESS] '
    else if(/^3\d+/.test(code))
        s = '[REDIRECTION] '
    else if(/^4\d+/.test(code))
        s = '[CLIENT ERROR] '
    else if(/^5\d+/.test(code))
        s = '[SERVER ERROR] '

    console.log(s + description)
    response.status(code).send({description : description})
}

/**
 * Restrict function. Check if the user is log in.
 * @param req
 * @param res
 * @param next
 */
function restrict(req, res, next) {
    if (req.session.userToken) {
        User.findOne({token : req.session.userToken}, function(err, obj) {
            if (obj) {
                next()
            }
            else {
                httpResponse(response,500,'Hike not found')
            }
        });
    } else {
        httpResponse(res,403,'Access denied !')
    }
}

/**
 *
 * @param request
 * @param response
 * @param name Name of the parameter to check
 * @param type Type of the parameter to check
 */
function checkParameter(request,response,name,type) {
    //TODO Check if the given parameter exists and if it is to the right format
}

/**
 * Export functions
 */
module.exports.httpResponse = httpResponse
module.exports.restrict = restrict
module.exports.checkParameter = checkParameter