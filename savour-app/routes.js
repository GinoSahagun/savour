// routes.js
// All routes are routed through here
var bodyParser = require("body-parser");
var express = require('express');
var restaurant = require('./restaurant.model');
var neighborhood = require('./neighborhood.model');
var router = express.Router();
var mongoose = require('mongoose');
var app = express();
var urlArgs;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Savour and Sip' });
});

/* GET about page. */
router.get('/about', function (req, res) {
    res.render('about', { title: 'About Savour and Sip' });
    //res.res('about', { title: 'Express' });
});

/* GET neighborhood page. */
router.get('/neighborhood', function (req, res) {
    res.render('neighborhood', { title: 'Neighborhood' });
});

//Get add restaurant page
router.get('/add', function (req, res) {
    res.render('add', { title: 'Add Restaurant or Coffee Shop' });
});

//Get add restaurant page
router.post('/add', function (req, res) {
    //Insert data into database test
    var deets = req.body;
    console.log(deets.id + "  -  " + deets.name);

    try {
        var tempRest = new restaurant({
            name: deets.name,
            location: deets.location,
            phone: deets.phone,
            hours: deets.hours,
            pricing: deets.pricing,
            rating: deets.rating,
            address: deets.address,
            category: deets.category,
            desc: deets.desc,
            website: deets.website,
            menu: deets.menu,
            owner: deets.owner
        });
    }
    catch (err) {
        console.log(err);
    }

    tempRest.save(function (err, tempRest) {
        if (err != null) return console.error(err);
        console.log("Restaurant added");
        res.sendStatus(200)
    });
    
});

// Get restaurant page
router.get('/restaurant', function (req, res) {
    urlArgs = req.query; //get the URL Arguments if any
    res.render('restaurant', { title: 'Restaurant' });
});

//Using load Restaurant Data Function get Json request
router.get('/restaurant-data', function (req, res) {
    console.log('Getting Restaurants...');
    var resStr;
    if (urlArgs != "") {
        console.log("id: ", urlArgs.id);
        var o_id = mongoose.Types.ObjectId(urlArgs.id); //convert into Object ID

        console.log("obj: ", o_id); //Object Id check
      
        //then we query the database for the specifc Object ID
        restaurant.findById(o_id, function (err, doc) {
            if (err) {
                console.log("Error Occured");
                res.send(err + '\nError Has Occurred') //respond with error occured
            }
            else {
                resStr = JSON.parse(JSON.stringify(doc)); //JsonParse Queried Data                
                res.send(resStr); //send response back
            }
        });        
    }
    
});

//Retrieve collections from database
router.get('/search', function (req, res) {
    console.log('Getting Restaurants...');
    var resultsStr = [];
    restaurant.find(function (err, results) {
        if (err) {
            console.log('Getting Restaurants...');
            res.send(err + '\nError Has Occurred')
        } else {
            console.log(results);
            resultsStr = JSON.parse(JSON.stringify(results))
            //stuff = JSON.parse(results);
            //console.log(resultsStr + "\n");

            //console.log(resultsStr);
            res.render('search', { title: 'Search', results: resultsStr });
        }
    });

});

//Using load Neighborhood Data Function get Json request
router.get('/neighborhood-data', function (req, res) {
    console.log('Getting Neighborhood...');
    var neighborhoodStr;
    if (urlArgs != "") {
        console.log("id: ", urlArgs.id);
        var o_id = mongoose.Types.ObjectId(urlArgs.id); //convert into Object ID

        console.log("obj: ", o_id); //Object Id check

        //then we query the database for the specifc Object ID
        neighborhood.findById(o_id, function (err, doc) {
            if (err) {
                console.log("Error Occured");
                res.send(err + '\nError Has Occurred') //respond with error occured
            }
            else {
                neighborhoodStr = JSON.parse(JSON.stringify(doc)); //JsonParse Queried Data                
                res.send(neighborhoodStr); //send response back
            }
        });
    }

});
module.exports = router;