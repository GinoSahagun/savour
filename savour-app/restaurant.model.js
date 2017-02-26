var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Define Restaurant schema
var restaurantSchema = new Schema({
    name: String,
    location: String,
    id: String,
    phone: String,
    hours: String,
    pricing: Number,
    rating: Number,
    address: String,
    category: String,
    desc: String,
    website: String,
    menu: String,
    owner: String
}, { collection: 'rest' });

//Create Model and export it
module.exports = mongoose.model('rest', restaurantSchema);