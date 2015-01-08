/**
 * Created by thomasthiebaud on 06/12/14.
 */
var Entities = require('ent')
var User = require(__base + 'services/database/model.js').User


/**
 * Return http response. Print message in console.
 * @param response
 * @param code Http status code
 * @param description Description of the response
 */
function httpResponse(response,code,description,content) {
    var s

    if(/^1\d+/.test(code)) {
        s = '[INFORMATION] '
        log.info(s + description)
    } else if(/^2\d+/.test(code)) {
        s = '[SUCCESS] '
        log.info(s + description)
    } else if(/^3\d+/.test(code)) {
        s = '[REDIRECTION] '
        log.info(s + description)
    } else if(/^4\d+/.test(code)) {
        s = '[CLIENT ERROR] '
        log.error(s + description)
    } else if(/^5\d+/.test(code)) {
        s = '[SERVER ERROR] '
        log.error(s + description)
    }

    response.writeHead(code, { 'Content-Type': 'application/json' });

    if(content === undefined)
        response.write(JSON.stringify({description : description}))
    else
        response.write(JSON.stringify({description : description,content : decode(content)}))

    response.end()
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

function distance(lat1,long1,lat2,long2) {
    var R = 6378137
    var r1 = Math.pow(Math.sin((lat2-lat1)/2),2)
    var r2 = Math.pow(Math.sin((long2-long1)/2),2)
    return 2 * R * Math.sqrt(r1 + Math.cos(lat1) * Math.cos(lat2) * r2)
}

/**
 * Sanitize input by calling ent.encode(). All HTML and NodeJS special 
 * chars are transcoded to HTML representation
 */
 function encode(req, res, next){
    var arr = encodeJSON(req.body, 0);
    if(arr[1] == -1){
        httpResponse(res,500,'The JSON was not correct. Cannot accept data.');
    }
    else{
        req.body = arr[0];
        next();
    }
 }

/**
 * Recursive function that sanitize an object. The recursivity works because
 * no callbacks are called.
 */
 function encodeJSON(object, error){
    if(typeof object === 'string' || object instanceof String > 0){
        object = Entities.encode(object, {numeric : true, named : false});
    }
    else if(Array.isArray(object)){
        for (var i = 0; i < object.length; i++) {
            var arr = encodeJSON(object[i], error);
            object[i] = arr[0];
            error = (arr[1] == -1) ? arr[1] : error;
        };
    }
    else if(typeof object === 'object' || object instanceof Object > 0){
        //Get an array of key from Object req.body
        var values = Object.keys(object);
        values.forEach(function(value){
            var arr = encodeJSON(object[value], error);
            object[value] = arr[0];
            error = (arr[1] == -1) ? arr[1] : error;
        });
    }
    else{
        error = -1;
    }
    return [object, error];
 }

function decode(object) {
    var arr = decodeJSON(object, 0);
    return arr[0]
}

function decodeJSON(object,error) {
    if(typeof object === 'string' || object instanceof String > 0){
        object = Entities.decode(object, {numeric : true, named : false});
    }
    else if(Array.isArray(object)){
        for (var i = 0; i < object.length; i++) {
            var arr = decodeJSON(object[i],error);
            object[i] = arr[0];
            error = (arr[1] == -1) ? arr[1] : error;
        };
    }
    else if(typeof object === 'object' || object instanceof Object > 0){
        //Get an array of key from Object req.body
        var values = Object.keys(object);
        values.forEach(function(value){
            var arr = decodeJSON(object[value],error);
            object[value] = arr[0];
            error = (arr[1] == -1) ? arr[1] : error;
        });
    }
    else{
        error = -1;
    }
    return [object, error];
}


/**
 * Export functions
 */
module.exports.httpResponse = httpResponse
module.exports.restrict = restrict
module.exports.checkParameter = checkParameter
module.exports.distance = distance
module.exports.encode = encode