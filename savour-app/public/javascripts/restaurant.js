
//var ObjectId = require('mongodb').ObjectId; //create instance of Object ID
//Document Ready Function
$(document).ready(function () {
    
    //function load for span tags
    $(function () {
    
        // Assign handlers immediately after making the request,
        // and remember the jqxhr object for this request
    
        var jqxhr = $.getJSON("restaurant-data", function () {
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
              else
            {
                res = JSON.parse(JSON.stringify(parsedResponse)); //may be pointless operaton as its already a json object response
            }
            console.log("second complete");
            
            //reload json stuff here
        
            console.log("res: ", res.desc); //check to see if object was working
            
            $('#restImage').attr('src', 'images/curbside.jpg');
            //Restaurant Name
            $("#restName").text(res.name);
            //Restuaran Rating Stars
            $("#restStars").text(res.rating);
            //Start Time
            $("#startHour").text("10:00am");
            //End Time
            $("#endHour").text("9:00pm");
            //Bio for restaurants
            $("#bio").text(res.desc+"👍"); 
           
        });
    
        // if we dont find the id then "not found page". Right now I'll make Curbside default page
        //source image
        $('#restImage').attr('src', 'images/curbside.jpg');
        //Restaurant Name
        $("#restName").text("Curbside");
        //Restuaran Rating Stars
        $("#restStars").text("5");
        //Start Time
        $("#startHour").text("10:00am");
        //End Time
        $("#endHour").text("9:00pm");
        //Bio for restaurants
        $("#bio").text("Fairly quick, super cheap, and very very delicious. Staff is very friendly!  Definetly a new lunch spot!👍"); 
    });
    
    

});