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
                row += "Rating: <span><input type=\"text\" class=\"rating\" value=\"" + data.rating + "\"disabled><br>";
                row += "Price: <span><input type=\"text\" class=\"pricing\" value=\"" + data.pricing + "\"disabled><br>";
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
                row += "<button class=\"save\" disabled> Save </button> </figcaption ></figure > ";
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
                $("input").prop("disabled", false);
                $(".save").prop("disabled", false);
            });

            $(".save").click(function () {
                $("input").prop("disabled", true);
                $(".save").prop("disabled", true);

                //Get updated restaurant information 
                var updatedRest = new RestaurantClass()

                //Call ajax method to update restaurant
                 $.ajax({
                     url: "./update-restaurant",
                     type: "POST",
                     data: updatedRest,
                 }).done(function () {
                     console.log("Restaurant Updated");
                     toastr.success("Restaurant Updated!");
                 });
            });

        });
    });

 
});

function RestaurantClass() {
    this.id = $("button.save").closest('.show').find('.id')["0"].innerHTML.substr(15);
    this.name = $("button.save").closest('.show').find('.name')["0"].value;
    this.phone = $("button.save").closest('.show').find('.phone')["0"].value;
    this.hours = $("button.save").closest('.show').find('.hours')["0"].value;
    this.pricing = $("button.save").closest('.show').find('.pricing')["0"].value;
    this.rating = $("button.save").closest('.show').find('.rating')["0"].value;
    this.address = $("button.save").closest('.show').find('.address')["0"].value;
    this.location = $("button.save").closest('.show').find('.location')["0"].value;
    this.desc = $("button.save").closest('.show').find('.description')["0"].value;
    this.website = $("button.save").closest('.show').find('.website')["0"].value;
    this.menu = $("button.save").closest('.show').find('.menu')["0"].value;
    this.image = $("button.save").closest('.show').find('.image')["0"].value;
}
