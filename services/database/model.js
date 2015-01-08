/**
 * Created by thomasthiebaud on 17/12/14.
 */

var mongoose = require(__base + 'services/database/database.js').mongoose

/**
 * MongoDB schema
 */
var userSchema = mongoose.Schema({
    token           : String,
    username		: String,
    password		: String,
    email	        : String,
    hikes           : [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Hike'
    }],
    history         : [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Hike'
    }]
})

var hikeSchema = mongoose.Schema({
    name            : String,
    isPrivate       : Boolean,
    duration        : Number,
    length          : Number,
    owner           : {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    coordinates     : [{
        lat: Number,
        long: Number
    }]
})

/**
 * Mongo model
 */
module.exports.User = mongoose.model('User', userSchema)
module.exports.Hike = mongoose.model('Hike', hikeSchema)