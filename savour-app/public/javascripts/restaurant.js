
//var ObjectId = require('mongodb').ObjectId; //create instance of Object ID
//Document Ready Function

    
    //function load for span tags
 $(function () {
     var holdURL = window.location.href;
        // Assign handlers immediately after making the request,
        // and remember the jqxhr object for this request

     

     var urlID = getUrlParameter('id');
     console.log("URL-id", urlID);
     if (urlID) {
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

                 console.log("res: ", res.desc); //check to see if object was working
                 console.log("res: ", res.rating); //check to see if object was working
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

                 //Start Time
                 $("#startHour").text("10:00am");
                 //End Time
                 $("#endHour").text("9:00pm");
                 //Bio for restaurants
                 $("#bio").text(res.desc + "👍");

             })
             .fail(function () {
                 console.log("error");
             })
             .always(function () {
                 console.log("complete");
             });

     }
     else {
     //Pop Up a status message
         $('#statusmessage').text('No Id Was Passed').animate({ 'margin-bottom': 0 }, 200);
         setTimeout(function () {
             $('#statusmessage').animate({ 'margin-bottom': -25 }, 200);
         }, 5 * 1000);
     //redirect to home page if no ID was passed
         document.location.href = "/";
        
     }
        // Perform other work here ...
     //Testing Review Rating for Submition
     $(".rating").rate();

     //options example
     var options = {
         max_value: 6,
         step_size: 0.5,
     }
     $(".rating").rate(options);

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
        submitform();
        return false;
    });
        

       


 });
    
//Submit Form
function submitform() {
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