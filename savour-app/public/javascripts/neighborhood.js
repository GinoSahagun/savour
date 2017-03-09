//var ObjectId = require('mongodb').ObjectId; //create instance of Object ID
//Document Ready Function
$(document).ready(function () {

    //function load for span tags
    $(function () {

        // Assign handlers immediately after making the request,
        // and remember the jqxhr object for this request

        var jqxhr = $.getJSON("neighborhood-data", function () {
            console.log("success");
        })
            .done(function () {
                console.log("second success");
            })
            .fail(function () {
                console.log("error");
            })
            .always(function () {
                console.log("complete");
            });


        // Perform other work here ...

        // Set another completion function for the request above
        jqxhr.done(function (parsedResponse, statusText, jqXhr) {
            var res;
            //Recievd Response Text as JSON hopefully
            if (typeof parsedResponse === 'string')
                res = parsedResponse;
            else {
                res = JSON.parse(JSON.stringify(parsedResponse)); //may be pointless operaton as its already a json object response
            }
            console.log("second complete");

            //reload json stuff here

            console.log("res: ", res.desc); //check to see if object was working

            //Neighborhood name
            $('#neighborhoodName').text(name);
            //Neighborhood bio
            $("#neighborhoodBio").text(description);
            //Neighborhood image
            $('#neighborhoodImg').attr('src', image);
            //Neighborhood radius
            $('#neighborhoodRadius').text(radius);
            //Neighborhood location
            $('#neighborhoodLocation').text(location);
        });

        // if we dont find the id then "not found page". Right now I'll make Curbside default page
        //Neighborhood name
        $('#neighborhoodName').text("Queen Anne");
        //Neighborhood bio
        $("#neighborhoodBio").text("Queen Anne Hill is an affluent neighborhood and geographic feature in Seattle, northwest of downtown. The neighborhood sits on the highest named hill in the city, with a maximum elevation of 456 feet (139 m). It covers an area of 7.3 square kilometers (2.8 sq mi), and has a population of about 28,000. Queen Anne is bordered by Belltown to the south, Lake Union to the east, the Lake Washington Ship Canal to the north and Interbay to the west.");
        //Neighborhood image
        $('#neighborhoodImg').attr('src', "images/queenanne.jpg");
        //Neighborhood radius
        $('#neighborhoodRadius').text(2.6);
        //Neighborhood location
        $('#neighborhoodLocation').text("47.637165, -122.356931");
    });



});