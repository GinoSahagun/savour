var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//Define Filter schema
var matchSchema = new Schema({
    id: String,
    restID: String,
    filterID: String
}, {collection: "matches" });

//Create Model and export it
module.exports = mongoose.model("match", matchSchema);