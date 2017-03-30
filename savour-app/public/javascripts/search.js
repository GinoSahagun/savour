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
                row += "Description: <input type=\"text\" id=\"description\" value=\"" + data.desc +"\"disabled><br>";
                row += "Rating: <span><input type=\"text\" id=\"rating\" value=\"" + data.rating + "\"disabled><br>";
                row += "Price: <span><input type=\"text\" id=\"pricing\" value=\"" + data.pricing + "\"disabled><br>";
                row += "Address: <input type=\"text\" id=\"address\" value=\"" + data.address + "\"disabled><br>";
                row += "Hours: <input type=\"text\" id=\"hours\" value=\"" + data.hours.FRI + "\"disabled><br>";  //Need to display all hours!!!
                row += "Location: <input type=\"text\" id=\"location\" value=\"" + data.location.LAT + ", " + data.location.LON + "\"disabled><br>";
                row += "<h6 class = \"id\">Object ID: " + data._id + "</h5>";
                row += "<button id=\"delete\" class=\"delete\"> Delete </button> <button class=\"edit\"> Edit </button>";
                row += "<button class=\"save\"> Save </button> </figcaption ></figure > ";
                return row;
            }

            $(".delete").click(function () {
                var choice = confirm("Are you sure you want to delete this restaurant?");
                if (choice == true) {
                    //Get closest restaurant ID
                    var id = $(this).prev("h6")["0"].innerHTML;
                    id = id.substr(11); //extract id
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

            $(".edit").click(function () {
                $("input").prop('disabled', false);
            });

            $(".save").click(function () {
                $("input").prop('disabled', true);

                //Get closest restaurant ID
                var id = $(this).prev("h6")["0"].innerHTML;
                id = id.substr(11); //extract id

                //Get updated info
                //var desc = document.querySelector("input").closest("#description");

                //Call ajax method to update restaurant
                /* $.ajax({
                     url: "./update-restaurant",
                     type: "POST",
                     data: { rest: id }
                 }).done(function () {
                     console.log("Restaurant Updated");
                 });*/
            });

        });
    });

 
});
