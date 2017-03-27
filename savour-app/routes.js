﻿// routes.js
// All routes are routed through here
var bodyParser = require("body-parser");
var express = require('express');
var restaurant = require('./restaurant.model');
var match = require('./match.model');
var neighborhood = require('./neighborhood.model');
var review = require('./review.model');
var filter = require('./filter.model');
var router = express.Router();
var mongoose = require('mongoose');
var app = express();


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

/* GET login page. */
router.get('/login', function (req, res) {
    res.render('login', { title: 'Login' });
    //res.res('about', { title: 'Express' });
});

/* GET neighborhood page. */
router.get('/neighborhood', function (req, res) {
    res.render('neighborhood', { title: 'Neighborhood' });
});

//Using load Neighborhood Data Function get Json request
router.get('/neighborhood-data', function (req, res) {
    console.log('Getting Neighborhood...');

    var neighborhoodStr;
    var userLocation = req.query.location;
    if (userLocation != "" && userLocation != null) {
        console.log("User Location: ", userLocation.lat, userLocation.lng); //Check to see if we got user location
        var o_id = mongoose.Types.ObjectId(userLocation.id); //convert into Object ID

        //Default neighborhood for now - Queen Anne rom database
        o_id = "58c0d26473beb886d72bbcf3"
        console.log("obj: ", o_id); //Object ID check

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
    else {
        res.send(err + '\nError Has Occurred') //respond with error occured
    }

});

//Add new filters to database

router.post('/addFilter', function (req) {
    //Insert filter into database
    addFilter(req.body.filter);
});


//Get add restaurant page
router.get('/add', function (req, res) {
    res.render('add', { title: 'Add Restaurant or Coffee Shop' });
});

//Get add restaurant page
router.post('/add', function (req, res) {
    //Insert data into database
    var deets = req.body;
    console.log(deets.id + "  -  " + deets.name);

    try {
        var location = JSON.parse(deets.location);
        var hours = JSON.parse(deets.hours);

        var tempRest = new restaurant({
            name: deets.name,
            location: location,
            phone: deets.phone,
            hours: hours,
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
        res.sendStatus(200);
    });

});

//Get filter data
router.get('/filter-data', function (req, res) {
    console.log('Checking filter...');

    var filterName = req.query.name;
    //Query database for filter name
    filter.findOne({ 'name' : filterName }, function (err, filter) {
        if (err) {
            res.send(err);
            return handleError(err);
        }
        else {
            res.send(filter);   //Found filter! Return it
            console.log('Filter: ', filterName)
        }
    })
});

//Post filters
router.post("/filters-add", function (req, res) {
    var restName = req.body["rest[name]"];
    var restAddress = req.body["rest[address]"];
    var filterStr = req.body.filter;
    var restId;

    restaurant.findOne({ "name": restName, "address": restAddress }, function (err, restaurant) {
        if (err) return handleError(err);
        else {
            console.log(restaurant._id)
            restId = restaurant._id;
        }

        var filterList = filterStr.split(",");

        //for (i = 0; i < filterList.length; i++) {
        for (thefilter of filterList) {
            console.log(thefilter);

            //Check to see if filter exists
            filter.findOne({ "name": thefilter }, function (err, filter) {
                if (err) {
                    console.log("Error");   //Error in query for some reason
                    return;
                }
                if (filter) {
                   addMatch(restId, filter._id);
                }
                else {
                    console.log("Filter does not exist");
                }
            })
        }
    })
});

function addMatch(rest, filt) {
    try {
        var tempMatch = new match({
            restID: rest,
            filterID: filt
        });

        tempMatch.save(function (err, tempMatch) {
            if (err != null) return console.error(err);
            console.log("Match added!");
            return 0;
        });
    }
    catch (err) {
        console.log(err);
        return err;
    }
}

function addFilter(filterName) {
    //Insert filter into database    
    filterName = filterName.toLowerCase();
    var tempFilter = new filter({
        name: filterName,
    });
    filter.findOne({ "name": filterName }, function (err, filter) {
        if (err) {
            console.log("Error");   //Error in query for some reason
            return;
        }
        if (filter) {
            console.log("Filter already exists");
        }
        else {
            console.log("Creating Filter '" + filterName + "'");
            try {
                tempFilter.save(function (err, tempFilter) {
                    if (err != null) return console.error(err);
                    console.log("Filter added");
                });
            }
            catch (err) {
                console.log(err);
            }
        }
    });
}

// Get restaurant page
router.get('/restaurant', function (req, res) {
    res.render('restaurant', { title: 'Restaurant' });
});

//Post review restaurant page
router.post('/restaurant', function (req, res) {
    //Insert data into database test
    var deets = req.body;
    console.log(deets.id + "  -  " + deets.comment);

    try {
        var tempReview = new review({
            id: deets.id,
            rating: parseFloat(deets.rating),
            review: deets.comment,
            name: deets.name
        });
    }
    catch (err) {
        console.log(err);
    }

    tempReview.save(function (err, tempReview) {
        if (err != null) return console.error(err);
        console.log("Review added");
        res.sendStatus(200);
    });

});
//Using load Restaurant Data Function get Json request
router.get('/restaurant-data', function (req, res) {
    console.log('Getting Restaurants...');
    var args = req.query.id;
    var resStr;
    if (args != "" || args!= null) {
        console.log("id: ", args.id);
        var o_id = mongoose.Types.ObjectId(args); //convert into Object ID
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
//Using load Restaurant Data Function get Json request
router.get('/review-data', function (req, res) {
    console.log('Getting Reviews...');
    var args = req.query.id;
    var resStr;
    if (args != "" || args != null) {
        
         
        //then we query the database for the specifc Object ID
        review.find({ 'id': { $in: args } } ,function (err, doc) {
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
    res.render('search', { title: 'Search'});
});
//Retrieve collections from database
router.get('/search-data', function (req, res) {
    console.log('Getting Restaurants...');
    var resultsStr = [];
    restaurant.find(function (err, results) {
        if (err) {
            console.log('Getting Restaurants...');
            res.send(err + '\nError Has Occurred')
        } else {
            console.log(results);
            resultsStr = JSON.parse(JSON.stringify(results))
            res.send(resultsStr);  
        }
    });

});

module.exports = router;