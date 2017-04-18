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

            for (d of res) {
                var newRow = CreateRow(d);
                $(".list").append(newRow);
            }

            $(".toggle-more-less").click(function () {
                $(this).closest("figure").find("figcaption").toggleClass("show"); //toggle the restaurant's details
            });

            function CreateRow(data) {
                var row = "<figure><button class=\"toggle-more-less\">" + data.name + "</button><figcaption>";
                row += "Name: <input type=\"text\" class=\"name\" value=\"" + data.name + "\"disabled><br>";
                row += "Description: <input type=\"text\" class=\"description\" value=\"" + data.desc +"\"disabled><br>";
                row += "Rating: <input type=\"text\" class=\"restRating\" value=\"" + data.rating + "\"disabled><br>";
                row += "Price: <input type=\"text\" class=\"pricing\" value=\"" + data.pricing + "\"disabled><br>";
                row += "Address: <input type=\"text\" class=\"address\" value=\"" + data.address + "\"disabled><br>";
                var hours = JSON.stringify(data.hours);
                hours = hours.replace(/\"/g, "'");
                row += "Hours: <input type=\"text\" class=\"hours\" value=\"" + hours + "\"disabled><br>";  //Need to display all hours!!!
                row += "Location: <input type=\"text\" class=\"location\" value=\"" + data.location.LAT + ", " + data.location.LON + "\"disabled><br>";
                row += "Phone: <input type=\"text\" class=\"phone\" value=\"" + data.phone + "\"disabled><br>";
                row += "Website: <input type=\"text\" class=\"website\" value=\"" + data.website + "\"disabled><br>";
                row += "Menu: <input type=\"text\" class=\"menu\" value=\"" + data.menu + "\"disabled><br>";
                row += "Image: <input type=\"text\" class=\"image\" value=\"" + data.image + "\"disabled><br>";
                row += "<h6 class = \"id\">Restaurant ID: " + data._id + "</h6>";
                row += "<button id=\"delete\" class=\"delete\"> Delete </button> <button class=\"edit\"> Edit </button>";
                return row;
            }

            $(".delete").click(function () {
                var choice = confirm("Are you sure you want to delete this restaurant?");
                if (choice == true) {
                    //Get closest restaurant ID
                    var id = $(this).prev("h6")["0"].innerHTML;
                    id = id.substr(15); //extract id
                    //Call ajax method to delete restaurant
                    $.ajax({
                        url: "./delete-restaurant",
                        type: "POST",
                        data: { rest: id }
                    }).done(function () {
                        console.log("Restaurant Deleted");
                        location.reload();
                    });
                }
            });

            $(".edit").click(function () {
                var id = $(this).closest('.show').find('.id')[0].innerHTML
                id = id.substr(15); //extract id
                var url = "./edit?id=";
                window.location.href = url + id;
            });

        });
    });

 
});

