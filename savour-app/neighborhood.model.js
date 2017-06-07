var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Define Restaurant schema
var neighborhoodSchema = new Schema({
    id: String,
    location: Object,
    radius: Number,
    desc: String,
    name: String,
    image: String
}, { collection: 'neighborhood' });

//Create Model and export it
module.exports = mongoose.model('neighborhood', neighborhoodSchema);