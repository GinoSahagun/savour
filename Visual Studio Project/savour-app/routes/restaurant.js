/**
 * Created by CAR on 2/11/2017.
 */
var express = require('express');
var router = express.Router();

/* GET about page. */
router.get('/', function (req, res) {
    res.render('restaurant', { title: 'Express' });
    //res.res('about', { title: 'Express' });
});

module.exports = router;