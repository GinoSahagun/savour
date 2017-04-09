//var ObjectId = require("mongodb").ObjectId; //create instance of Object ID
//Document Ready Function
var userPos = {lat: 47.651395, lng: -122.361466};
$(function () {
    // Assign handlers immediately after making the request,
    // and remember the jqxhr object for this request
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(function (position) {
            userPos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
        });
    } else {
        window.alert("Turn on Geolocation!");
    }

    $.getJSON("neighborhood-data", {location: userPos})
        .fail(function () {
            //Default to Queen Anne
            //Neighborhood name
            $("#neighborhoodName").text("No neighborhood found, so here's Queen Anne!");
            //Neighborhood bio
            $("#neighborhoodBio").text("Queen Anne Hill is an affluent neighborhood and geographic feature in Seattle, northwest of downtown. The neighborhood sits on the highest named hill in the city, with a maximum elevation of 456 feet (139 m). It covers an area of 7.3 square kilometers (2.8 sq mi), and has a population of about 28,000. Queen Anne is bordered by Belltown to the south, Lake Union to the east, the Lake Washington Ship Canal to the north and Interbay to the west.");
            //Neighborhood image
            $("#neighborhoodImg").attr("src", "images/queenanne.jpg");
            //Neighborhood radius
            $("#neighborhoodRadius").text(2.6);
            //Neighborhood location
            $("#neighborhoodLocation").text("47.637165, -122.356931");
            window.alert("Could not get neighborhood.");
            console.log("Error - Could not retrieve neighborhood");
        })
        .always(function () {
            console.log("Complete");
        }).done(function (parsedResponse, statusText, jqXhr) {
            var res;
            //Recievd Response Text as JSON
            if (typeof parsedResponse === Object) {
                res = parsedResponse;
            } else {
                res = JSON.parse(JSON.stringify(parsedResponse)); //may be pointless operaton as its already a json object response
            }
            console.log("Second complete");

            //reload json stuff here
            //Neighborhood name
            $("#neighborhoodName").text(res.name);
            //Neighborhood bio
            $("#neighborhoodBio").text(res.desc);
            //Neighborhood image, we will do this in the Spring
            //$("#neighborhoodImg").attr("src", image);
            //Neighborhood radius, do we need this here?
            $("#neighborhoodRadius").text(res.radius);
            //Neighborhood location, do we need this here?
            $("#neighborhoodLocation").text(res.location);
        });
});