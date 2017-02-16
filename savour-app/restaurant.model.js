var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Define Restaurant schema
var restaurantSchema = new Schema({
    Name: String,
    Location: String,
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
    green: Boolean,
    local: Boolean,
    ownership: Boolean,
    vegan: Boolean,
    disability: Boolean
}, { collection: 'Restaurant' });

//Create Model and export it
module.exports = mongoose.model('restaurant-data', restaurantSchema);