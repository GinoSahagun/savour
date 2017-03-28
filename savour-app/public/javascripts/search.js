//Document Ready Function
$(document).ready(function () {

    //function load for span tags
    $(function () {

        // Assign handlers immediately after making the request,
        // and remember the jqxhr object for this request
        // Get Json from Search Data get Function
        var jqxhr = $.getJSON("search-data", function () {
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

        // Set another completion function for the request above
        jqxhr.done(function (parsedResponse, statusText, jqXhr) {
            var res;
            //Recievd Response Text as JSON hopefully
            if (typeof parsedResponse === "string") {
                res = parsedResponse;
            }
            else {
                res = JSON.parse(JSON.stringify(parsedResponse)); //may be pointless operation as its already a json object response
            }
            console.log("second complete");

            //reload json stuff here
            console.log("res: ", res); //check to see if object was working

            for (d of res) {
                var newRow = CreateRow(d);
                $(".list").append(newRow);
            }

            $(".toggle-more-less").click(function () {
                $(this).closest("figure").find("figcaption").toggleClass("show"); //toggle the restaurant's details
            });

            function CreateRow(data) {
                var row = "<figure><button class=\"toggle-more-less\">" + data.name + "</button><figcaption>";
                row += "<h5>Description: " + data.desc + "</h5>";
                row += "<h5>Rating: " + data.rating + "</h5>";
                row += "<h5>Price: " + data.pricing + "</h5>";
                row += "<h5>Address: " + data.address + "</h5>";
                row += "<h5>Hours: " + data.hours.FRI + "</h5>";
                row += "<h5>Location: " + data.location.LAT + ", " + data.location.LON + "</h5>";
                row += "<h6 class = \"id\">Object ID: " + data._id + "</h5>";
                row += "<button id=\"delete\" class=\"delete\"> Delete </button> <button> Edit </button></figcaption></figure > ";
                return row;
            }

            $(".delete").click(function () {
                var choice = confirm("Are you sure you want to delete this restaurant?");
                if (choice == true) {
                    //Get closest restaurant ID
                    var id = document.querySelector("h6").closest("h6");
                    id = id.innerHTML.substr(11); //extract id
                    //Call ajax method to delete restaurant
                    $.ajax({
                        url: "./delete-restaurant",
                        type: "POST",
                        data: { rest: id }
                    }).done(function () {
                        console.log("Filters Added");
                        location.reload();
                    });
                }
            });
        });
    });

 
});


