
var express = require('express');
var router = express.Router();

/* GET Rest Details PAge. */
router.get('/', function (req, res) {
    res.render('restaurant', { title: 'Restaurant Details' });
    //res.res('about', { title: 'Express' });
});

module.exports = router;