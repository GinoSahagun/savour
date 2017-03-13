var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Define Restaurant schema
var reviewSchema = new Schema({
    id: String,
    rating: Number,
    review: String
}, { collection: 'review' });

//Create Model and export it
module.exports = mongoose.model('review', reviewSchema);