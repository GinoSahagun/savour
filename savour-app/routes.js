// routes.js
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

// VERY BAD DONT DO THIS GLOBAL VARS ON SERVER ES NO BUENO
var docLength;;

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

//Delete restaurant from admin page
router.post('/delete-restaurant', function (req, res) {
    var restId = req.body.rest;

    //Delete the restaurant with this id
    restaurant.findByIdAndRemove(restId, function (err) {
        if (err)
            res.send(err);
        else {
            console.log("Restaurant deleted");
        }
    });

    //Query matches that have this rest id
    const stream = match.find({ restID: restId }).stream();

    stream.on('data', doc => {
        //Find each match and delete it
        match.findByIdAndRemove(doc._id, function (err) {
            if (err)
                res.send(err);
            else {
                console.log("Match deleted");
            }
        });
    });

    //Query reviews and delete those with this rest id
    const reviews = review.find({ id: restId }).stream();
    reviews.on('data', doc => {
        //Find each review and delete it
        review.findByIdAndRemove(doc._id, function (err) {
            if (err)
                res.send(err);
            else {
                console.log("Review deleted");
            }
        });
    });

    res.sendStatus(200);    //Send the good news

});

/* GET edit page. */
router.get('/edit', function (req, res) {
    res.render('edit', { title: 'Edit Restaurant' });
});

/* GET login page. */
router.get('/login', function (req, res) {
    res.render('login', { title: 'Login' });
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
router.post("/addFilter", function (req, res) {
    //Insert filter into database
    addFilter(req.body.tag);
    res.sendStatus(200); //Send the good news
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
        var filters = JSON.parse(deets.filters);

        var tempRest = new restaurant({
            name: deets.name,
            location: location,
            phone: deets.phone,
            hours: hours,
            pricing: deets.pricing,
            filters: filters,
            type: deets.type,
            rating: deets.rating,
            address: deets.address,
            category: deets.category,
            desc: deets.desc,
            website: deets.website,
            menu: deets.menu,
            image: deets.image,
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

//Get add restaurant page
router.get("/favorites", function (req, res) {
    res.render("favorites", { title: "My Places" });
});


//Get filter data
router.get("/filter-data", function (req, res) {
    console.log("Checking filter...");

    var filterName = req.query.name;
    //Query database for filter name
    filter.findOne({ "name": filterName }, function (err, filter) {
        if (err) {
            res.send(err);
            return handleError(err);
        }
        else {
            res.send(filter);   //Found filter! Return it
            console.log("Filter: ", filterName)
        }
    })
});

//Post filters
router.post("/filters-add", function (req, res) {
    var temp = req.body["rest"];
    var restName = temp.name;
    var restAddress = temp.address;
    var filterStr = req.body.tags;
    if (filterStr == "") {
        return;
    }
    var restId;

    restaurant.findOne({ "name": restName, "address": restAddress }, function (err, restaurant) {
        if (err) return handleError(err);
        else if (restaurant) {
            console.log(restaurant._id)
            restId = restaurant._id;
        }
        else {
            return;
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
                    console.log("Filter does not exist: " + thefilter);
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

//Get filter ids from matches
router.get("/filters-get", function (req, res) {
    console.log("Getting filters for restaurant...");
    var restId = req.query.id;
    var filters = [];

    match.find({ "restID": restId }).stream()
        .on("data", function (doc) {
            filters.push(doc.filterID);
        })
        .on("error", function (err) {
            // handle error
        })
        .on("end", function () {
            res.send(filters);
        });

});

//Get filter name and return it
router.get("/filter-name-get", function (req, res) {
    var filterId = req.query.filterID;

    filter.find({ "_id": filterId }, function (err, filter) {
        if (err) {
            console.log("Error");   //Error in query for some reason
            return;
        }
        if (filter) {
            res.send(filter[0].name);
        }
    });

});

//Get restaurant page
router.get("/restaurant", function (req, res) {
    res.render("restaurant", { title: "Restaurant" });
});

//Post review restaurant page
router.post("/restaurant", function (req, res) {
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
//Using load Restaurant Data Function get JSON request
router.get("/restaurant-data", function (req, res) {
    console.log("Getting Restaurants...");
    var args = req.query.id;
    var resStr;
    if (args != "" || args != null) {
        console.log("id: ", args.id);
        var o_id = mongoose.Types.ObjectId(args); //convert into Object ID
        console.log("obj: ", o_id); //Object Id check

        //then we query the database for the specific Object ID
        restaurant.findById(o_id, function (err, doc) {
            if (err) {
                console.log("Error Occurred");
                res.send(err + '\nError Has Occurred') //respond with error occurred
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
        review.find({ 'id': { $in: args } }, function (err, doc) {
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
router.get('/admin', function (req, res) {
    res.render('admin', { title: 'Administrator' });
});

//Retrieve collections from database
router.get('/search-data', function (req, res) {
    console.log('Getting Restaurants...');
    var activeFilters = req.query.tags;
    var filterIDs = [];
    var restaurants = [];

    if (activeFilters == undefined) {
        restaurant.find(function (err, results) {
            if (err) {
                res.send(err + '\nError Has Occurred')
            } else {
                //console.log(results);
                resultsStr = JSON.parse(JSON.stringify(results))
                res.send(resultsStr);
            }
        });
    }
    else {
        //Get filterIDs first
        filter.find({ name: { $in: activeFilters } }, function (err, doc) {
            if (err) {
                console.log("Error has occurred.");
                //res.send(err);
            }
            if (doc) {
                docLength = doc.length;
                for (var i = 0; i < doc.length; i++) {
                    filterIDs[i] = doc[i]._id;
                }
                //Now search for matches
                match.find({ filterID: { $in: filterIDs } }, function (err, doc2) {
                    if (err) {
                        console.log("Error has occurred.");
                    }
                    if (doc2) {
                        for (var i = 0; i < doc2.length; i++) {
                            restaurants[i] = doc2[i].restID;
                        }

                        //Now search for restaurants
                        restaurant.find({ _id: { $in: restaurants } }, function (err, doc3) {
                            if (err) {
                                console.log("Error has occured.");
                            }
                            if (doc3) {
                                console.log("Found restaurants for these filters!");
                                resultsStr = JSON.parse(JSON.stringify(doc3))
                                res.send(resultsStr);
                            }
                        });
                    }

                });
            }
        });
    }

});

//Update restaurant
router.post('/update-restaurant', function (req, res) {
    var deets = req.body;
    console.log(deets.id);

    //Find rest by ID and update in the database
    restaurant.findByIdAndUpdate(deets.id, { $set: deets }, { new: true }, function (err, restaurant) {
        if (err) return handleError(err);
        if (restaurant) {
            console.log("Restaurant updated");
            res.send(restaurant);
        }
    });

});
//Update restaurant
router.post("/update-rating", function (req, res) {
    var deets = req.body;
    console.log(deets);

    //Find rest by ID and update in the database
    restaurant.findByIdAndUpdate(deets.id, { $set: { rating: deets.rate } }, { new: true }, function (err, restaurant) {
        if (err) return handleError(err);
        if (restaurant) {
            console.log("Rating updated");
            res.send(restaurant);
        }
    });

});
module.exports = router;