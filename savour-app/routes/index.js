var express = require('express');
var router = express.Router();
var restaurant = require('../restaurant.model');

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Savour and Sip' });
});

/* GET about page. */
router.get('/about', function (req, res) {
    res.render('about', { title: 'About Savour and Sip' });
    //res.res('about', { title: 'Express' });
});

//Get add restuarant page
router.get('/add', function (req, res) {
    res.render('add', { title: 'Add Restaurant or Coffee Shop' });
});

// Get restaurant page
router.get('/restaurant', function (req, res) {
    res.render('restaurant', { title: 'Restaurant' });
});

//Retrieve collections from database
router.get('/search', function (req, res) {
    console.log('Getting Restaurants...');
    var resultsStr = [];
    restaurant.find(function (err, results) {
        if (err) {
            console.log('Getting Restaurants...');
            res.send('Error Has Occured')
        } else {
            console.log(results);
            resultsStr = JSON.parse(JSON.stringify(results))
            //stuff = JSON.parse(results);
            //console.log(resultsStr + "\n");

            //Insert data into database test
            /*var tempRest = new Restaurant({ Name: 'Yasuko Teriyaki', Location: 'Magnolia' });
            tempRest.save(function (err, tempRest) {
                if (err) return console.error(err);
            });*/

            //console.log(resultsStr);
            res.render('search', { title: 'Search', results: resultsStr });
        }

    });

});
module.exports = router;