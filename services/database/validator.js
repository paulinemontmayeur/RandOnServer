/**
 * Created by thomasthiebaud on 08/01/15.
 */

var User = require(__base + 'services/database/model.js').User
var Hike = require(__base + 'services/database/model.js').Hike

User.schema.path('username').validate(function (value) {
    return checkNull(value) && checkUndefined(value) && checkLength(value,0)
}, 'A username must be set');

User.schema.path('password').validate(function (value) {
    return checkNull(value) && checkUndefined(value) && checkLength(value,0)
}, 'A password must be set')

User.schema.path('password').validate(function (value) {
    return checkNull(value) && checkUndefined(value) && checkLength(value,0)
}, 'A password must be set')

/*
User.schema.path('password').validate(function (value) {
    var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,16}$/
    return re.test(value)
}, 'A password must contain at least one digit, one lower case, one upper and between 8 and 16 elements')
*/

User.schema.path('email').validate(function (value) {
    return checkNull(value) && checkUndefined(value) && checkLength(value,0)
}, 'An email must be set')

User.schema.path('email').validate(function (value) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(value);
}, 'Incorrect email format')

Hike.schema.path('name').validate(function (value) {
    return checkNull(value) && checkUndefined(value) && checkLength(value,0)
}, 'A name must be set')

Hike.schema.path('isPrivate').validate(function (value) {
    return checkNull(value) && checkUndefined(value) && checkLength(value,0)
}, 'A visibility must be set')

Hike.schema.path('duration').validate(function (value) {
    return checkNull(value) && checkUndefined(value) && checkLength(value,0)
}, 'A duration must be set')

Hike.schema.path('length').validate(function (value) {
    return checkNull(value) && checkUndefined(value) && checkLength(value,0)
}, 'A length must be set')

Hike.schema.path('date').validate(function (value) {
    return checkNull(value) && checkUndefined(value) && checkLength(value,0)
}, 'A date must be set')

Hike.schema.path('owner').validate(function (value) {
    return checkNull(value) && checkUndefined(value) && checkLength(value,0)
}, 'An owner must be set')

Hike.schema.path('positiveHeightDiff').validate(function (value) {
    return checkNull(value) && checkUndefined(value) && checkLength(value,0)
}, 'A positive height difference must be set')

Hike.schema.path('negativeHeightDiff').validate(function (value) {
    return checkNull(value) && checkUndefined(value) && checkLength(value,0)
}, 'A negative height difference must be set')

Hike.schema.path('averageSpeed').validate(function (value) {
    return checkNull(value) && checkUndefined(value) && checkLength(value,0)
}, 'An average speed must be set')

Hike.schema.path('coordinates').validate(function (value) {
    return checkNull(value) && checkUndefined(value) && checkLength(value,0)
}, 'A hike must contain an array of coordinates')



function checkNull(value) {
    return value !== null && value !== "null"
}

function checkUndefined(value) {
    return typeof value !== 'undefined'
}

function checkLength(value,length) {
    if(typeof value === 'string' || value instanceof String)
        return value.length > length
    else if(typeof value === 'array' || value instanceof Array)
        return value.length > length
    else
        return true
}