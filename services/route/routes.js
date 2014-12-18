var app = require(__base + 'app.js').app
var restrict = require(__base + 'services/utils/utils.js').restrict

var user = require(__base + 'services/profile/user.js')
var hike = require(__base + 'services/profile/hike.js')

/**
 * Login an user
 */
app.post('/user/login', function(request, response) {
    user.loginUser(request,response);
})

/**
 * Register an user
 */
app.post('/user/register', function(request, response) {
    user.registerUser(request,response);
})

/**
 * Logout an user
 */
app.get('/user/logout',restrict, function(request, response) {
    user.logoutUser(request,response);
})

/**
 * Create a hike
 */
app.post('/hike/create',restrict, function(request, response) {
    hike.createHike(request,response)
})

/**
 * Get public hikes overview
 */
app.get('/hike/overview',restrict, function(request, response) {
    hike.hikeOverview(request,response)
})

/**
 * Get specific hike
 */
app.get('/hike/specific',restrict, function(request, response) {
    hike.specificHike(request,response)
})

/**
 * Delete an hike
 */
app.post('/hike/remove',restrict, function(request, response) {
    hike.deleteHike(request,response)
})

/**
 * Change the hike's visibility
 */
app.post('/hike/hikeVisibility',restrict, function(request, response) {
    hike.deleteHike(request,response)
})

/**
 * Checks if the given name exists
 */
app.get('/hike/exists',restrict, function(request,response) {
    hike.exists(request,response)
})