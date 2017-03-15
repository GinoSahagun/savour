
//var ObjectId = require('mongodb').ObjectId; //create instance of Object ID
//Document Ready Function
//Extend the Date Function
(function () {
    var days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    Date.prototype.getMonthName = function () {
        return months[this.getMonth()];
    };
    Date.prototype.getDayName = function () {
        return days[this.getDay()];
    };
    Date.prototype.getDayNum = function () {
        return this.getDay();
    };
})();
//get Date variales
var now = new Date();
var day = now.getDayName();
var month = now.getMonthName();
var dayValue = now.getDayNum();
    
//document ready function 
 $(function () {
     var holdURL = window.location.href;
        // Assign handlers immediately after making the request,
        // and remember the jqxhr object for this request
     var urlID = getUrlParameter('id');
     console.log("URL-id", urlID);
     if (urlID) {
         getRestaurantData(urlID);
         getReviewData(urlID);

     }
     else {
     //Pop Up a status message
         
     //redirect to home page if no ID was passed
         document.location.href = "/";
         alert("This Is Not the Restaurant you were looking for");
        
     }
        // Perform other work here ...
     //Testing Review Rating for Submition
     $("#review-rating").rate();

     //options example
     var stuff = {
         max_value: 6,
         step_size: 0.5,
     }
     $("#review-rating").rate(stuff);

     //Create Div Here from Review Write One Button Slide Down and Slide Up
    $("#create-review-button").click(function () {
             if ($("#review-form").is(":hidden")) {
                 $("#review-form").slideDown("slow");
             }
             else {
                 $("#review-form").slideUp("slow");
             }
     });
     //Submit Form for a Creation of a review
    $("#submit-button").click(function () {
        submitform(urlID);
        return false;
    });
        

       


 });
    
//Submit Form
function submitform(urlID) {
    var rest = new reviewClass();
    console.log(rest);

    var json = $.parseJSON(JSON.stringify(rest));
    $.ajax({
        url: "./restaurant",
        type: "POST",
        data: json,
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.status);
            console.log("could not post data");
            window.alert("Could not add Review");
        }
    }).done(function () {
        //stay on the current page, let user know it worked, and slide up form
        //console.log(holdURL);
        //window.location = holdURL;
        $("#review-form").slideUp("slow");
        $("#comment").val("");

        getReviewData(urlID); //reload review data
        //Not working currently
        //$('#status-message').text("Review Posted").animate({ 'margin-bottom': 0 }, 200);
        //setTimeout(function () {
        //    $('#status-message').animate({ 'margin-bottom': -25 }, 200);
        //}, 5* 1000);
    });
}

//Review class Assocation with ID from Restaurant
function reviewClass() {
    this.comment = $("#comment").val();
    this.rating = $("#review-rating").rate("getValue");
    this.id = getUrlParameter('id');
    this.name = $("#restName").text();

}

//function called getURLparameters
function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};
//Create Cells for Reviews
function CreateRow(data) {
    if (data.id == null)
        data.id = "";

    var row = "<tr><td><a href=./restaurant?id=" + data.id + "><div class='col-md-10'>";
    row += data.name + "</div ></td><td><div class='col-md-2'></a><div class='rating'></div></div></td></tr>";
    row += "<tr><td colspan = '2'><div class='col-md-12'>";
    row += data.review + "</div ></td> </tr";
    //adjust the rate of it when created nvm wont work
    
    return row;
}

//for later use ask Matt what he thinks 
function createItem(data) {
    
   var item = "<li class='list-group-item'></li>";


   return item;
}



//Get the Restaurant Data through a JSON Call
function getRestaurantData(urlID) {
    $.getJSON("restaurant-data", { id: urlID })
        .done(function (parsedResponse) {
            console.log("second success");
            var res;
            //Recievd Response Text as JSON hopefully
            if (typeof parsedResponse === 'string')
                res = parsedResponse;
            else {
                res = JSON.parse(JSON.stringify(parsedResponse)); //may be pointless operaton as its already a json object response
            }
            console.log("second complete");

            //reload json stuff here
            console.log("res: ", res); //check to see if object was working
            console.log(dayValue);
            //console.log("res: ", res.desc); //check to see if object was working
            //console.log("res: ", res.rating); //check to see if object was working
            $('#restImage').attr('src', 'images/curbside.jpg');
            //Restaurant Name
            $("#restName").text(res.name);
            //Restuaran Rating Stars

            //Test Example of Rating Stars using standard rate
            var settings = {
                max_value: 5,
                initial_value: res.rating,
                readonly: true,
                step_size: 0.5,
            }
            $("#restStars").rate(settings);
            var result = [];
            //convert JSON into array
            for (var i in res.hours)
                result.push([i, res.hours[i]]);

            console.log(result); //check conversion 
           //look through all of the keys in hours
            Object.keys(res.hours).forEach(function (k) {
                console.log(k);
                if (k === day) {
                    $("#Day").text(day);
                    
                    
                }
            });
            $("#Hora").text(result[dayValue][1]); //Not Sure why this isnt working
            //Bio for restaurants
            $("#bio").text(res.desc + "👍");
            $("#address").text(res.address);

        })
        .fail(function () {
            console.log("error");
        })
        .always(function () {
            console.log("complete");
        });

}
//Get the Review Data through a JSON Call
function getReviewData(urlID) {

    //Test using 58c64e8b90ffbe4bcc94080e
    $.getJSON("review-data", { id: urlID })
        .done(function (parsedResponse) {
            console.log("second success");
            var res;
            //Recievd Response Text as JSON hopefully
            if (typeof parsedResponse === 'string')
                res = parsedResponse;
            else {
                res = JSON.parse(JSON.stringify(parsedResponse)); //may be pointless operaton as its already a json object response
            }
            console.log("second complete");
            //reload json stuff here
            var len = res.length;
            var tbl = $("#review-list");
            $("#review-list tr").remove();
            //Create Table of Review List
            if (len <= 10) {
                for (var i = len - 1; i >= 0; i--) {
                    var row = CreateRow(res[i]);
                    tbl.append(row);
                    $('.rating').rate({ readonly: true, initial_value: res[i].rating, change_once: true }); //needed for each appended rating
                }
                
            }
            else {
                for (var i = 10; i >= 0; i--) {
                    var row = CreateRow(res[i]);
                    tbl.append(row);
                }

            }

        })
        .fail(function () {
            console.log("error");
        })
        .always(function () {
            console.log("complete");
        });
}