/**
 * Created by thomasthiebaud on 06/12/14.
 */

/**
 * Return http response. Print message in console.
 * @param response
 * @param code Http status code
 * @param description Description of the response
 */
module.exports.httpResponse = function(response,code,description) {
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
    response.status(code).send({description : description});
}

/**
 *
 * @param request
 * @param response
 * @param name Name of the parameter to check
 * @param type Type of the parameter to check
 */
module.exports.checkParameter = function(request,response,name,type) {
    //TODO Check if the given parameter exists and if it is to the right format
}