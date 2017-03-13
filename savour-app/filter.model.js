var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Define Filter schema
var filterSchema = new Schema({
    id: String,
    name: String
}, { collection: 'filter' });

//Create Model and export it
module.exports = mongoose.model('filter', filterSchema);