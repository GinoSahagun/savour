//Document Ready Function
$(document).ready(function () {

    //function load for span tags
    $(function () {

        // Assign handlers immediately after making the request,
        // and remember the jqxhr object for this request
        // Get Json from Search Data get Function
        var jqxhr = $.getJSON("retrieve-all-restaurants", function () {
            console.log("success");
        })
            .done(function () {
                console.log("Ajax call done");
            })
            .fail(function () {
                console.log("Ajax call failed");
            })
            .always(function () {
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

            //Sort restaurants by name before printing to screen
            res = res.sort(dynamicSort("name"));

            for (d of res) {
                var newRow = CreateRow(d);
                $(".list").append(newRow);
            }

            $(".toggle-more-less").click(function () {
                $(this).closest("figure").find("figcaption").toggleClass("show"); //toggle the restaurant's details
            });

            function CreateRow(data) {
                var row = "<figure><button class=\"toggle-more-less\">" + data.name + "</button><figcaption>";
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

            $("#clean").click(function () {
                window.alert("Database Successfully Cleaned");
            });

        });
    });

 
});

function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

