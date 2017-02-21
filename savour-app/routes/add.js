
var express = require('express');
var router = express.Router();


/* GET add rest page. */
router.get('/', function (req, res) {
    res.render('add', { title: 'Add new Restaurant' });
});

module.exports = router;