var express = require('express');
var router = express.Router();

///* GET home page. */
//router.get('/', function (req, res) {
//    res.render('index', { title: 'Express' });
//});

// ./routes/index.js
exports.index = function (req, res) {
    res.render('index', { title: 'ejs' });
};

module.exports = router;