var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Savour and Sip' });
});
/* GET about page. */
router.get('/about', function (req, res) {
    res.render('about', { title: 'About Savour and Sip' });
    //res.res('about', { title: 'Express' });
});
//Get add page
router.get('/add', function (req, res) {
    res.render('add', { title: 'Add Restaurant or Coffee Shop' });
    //res.res('about', { title: 'Express' });
});
//restaurant page
router.get('/restaurant', function (req, res) {
    res.render('restaurant', { title: 'Restaurant' });
    //res.res('about', { title: 'Express' });
});
module.exports = router;