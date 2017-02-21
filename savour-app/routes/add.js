var express = require('express');
var router = express.Router();

/* GET about page. */
router.get('/add', function (req, res) {
    res.render('add', { title: 'Add Restaurant or Coffee Shop' });
    //res.res('about', { title: 'Express' });
});

module.exports = router;