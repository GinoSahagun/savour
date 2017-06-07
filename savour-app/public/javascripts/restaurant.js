

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
var filterArray = [];

//Document Ready Function
$(function () {
    var holdURL = window.location.href;
    // Assign handlers immediately after making the request,
    // and remember the jqxhr object for this request
    var urlID = getUrlParameter('id');
    //set up the bottom center toast
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-bottom-center",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "500",
        "timeOut": "2000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
    //Loading GIF
    $body = $("body");
    $(window).ajaxStart(function () {
        $body.addClass("loading");
    });
    $(window).ajaxStop(function () {
        $body.removeClass("loading");
    });
    if (urlID) {
        getRestaurantData(urlID);
    }
    else {
        //Pop Up a status message
        //redirect to home page if no ID was passed
        document.location.href = "/";
    }

    //options example
    var stuff = {
        max_value: 5,
        step_size: 1,
        selected_symbol_type: 'image2',
        symbols: {
            image2: {
                base: '<div class="im"></div>',
                hover: '<div class="im2"></div>',
                selected: '<div class="im2"></div>',
            },
        },
    }
    $("#review-rating").rate(stuff);
    //Test Example of Rating Stars using standard rate
    var settings = {
        max_value: 5,
        initial_value: 2,
        readonly: true,
        step_size: 0.5,
        selected_symbol_type: 'image2',
        symbols: {
            image2: {
                base: '<div class="im"></div>',
                hover: '<div class="im2"></div>',
                selected: '<div class="im2"></div>',
            },
        },
    }
    $("#restStars").rate(settings);

    //On Change Rest Stars
    $("#restStars").on("change", function (ev, data) {
        var arg = urlID;
        console.log(arg);
        console.log(data.from, data.to);

        updateRating(arg, data.to);

    });

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

    //toggle Hours table
    $("#times").click(function () {
        if ($(".table-responsive").css('display') == 'none') {
            document.getElementById("times").style.display = "none";
        }
        $(".table-responsive").toggle();
    });

    $(".table-responsive").click(function() {
        if (document.getElementById("times").style.display == "none") {
            document.getElementById("times").style.display = "block";
            $(".table-responsive").toggle();
        }
    });

    $(document).ready(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });

    $("#favorite").click(function () {
        var src = $("#favorite").attr("src");
        if (src.indexOf("-i.png") < 0) {
            //Unfavorite this restaurant
            var storedRestaurants = JSON.parse(localStorage.getItem("savourFavRestaurants"));
            
            if (storedRestaurants.indexOf(urlID) != -1) {
                //Remove from local storage
                storedRestaurants.splice(storedRestaurants.indexOf(urlID), 1);
                localStorage.setItem("savourFavRestaurants", JSON.stringify(storedRestaurants));
            } 
            $("#favorite").attr("src", src.replace(".png", "-i.png"));  //make heart gray

        } else {
            //Check to see if browser supports local storage
            if (typeof (Storage) !== "undefined") {
                //Set heart to red
                $("#favorite").attr("src", src.replace("-i.png", ".png"));

                //Check to see if there is already an array with saved data
                if (localStorage.getItem("savourFavRestaurants") != null) {
                    var rests = JSON.parse(localStorage.getItem("savourFavRestaurants"));
                    rests.push(urlID);
                    localStorage.setItem("savourFavRestaurants", JSON.stringify(rests));
                }
                else {
                    //Create new local storage array for the user, push restaurant into array
                    var savourFavRestaurants = [];
                    savourFavRestaurants.push(urlID);
                    localStorage.setItem("savourFavRestaurants", JSON.stringify(savourFavRestaurants));
                }
               
            }
            
        }
    });

    //Set favorites heart if restaurant is in favorites
    var storedRestaurants = JSON.parse(localStorage.getItem("savourFavRestaurants"));
    if (storedRestaurants != null) {
        if (storedRestaurants.indexOf(urlID) != -1) {
            var src = $("#favorite").attr("src");
            $("#favorite").attr("src", src.replace("-i.png", ".png"));
        }
    }

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
            console.log("Could not post data");
            window.alert("Could not add Review");
        }
    }).done(function () {
        //stay on the current page, let user know it worked, and slide up form
        //console.log(holdURL);
        //window.location = holdURL;
        $("#review-form").slideUp("slow");
        $("#comment").val("");

        getReviewData(urlID); //reload review data
    });
}

//Review class Association with ID from Restaurant
function reviewClass() {
    this.comment = $("#comment").val();
    this.rating = $("#review-rating").rate("getValue");
    this.id = getUrlParameter('id');
    this.name = $("#restName").text();
    this.title = $("#title").val();

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
    var temp = data.title;
    if (data.title == "" || (typeof (data.title) == "undefined"))
        temp = data.name;

    var row = "<tr><td><a href=./restaurant?id=" + data.id + "><div class='col-md-10'>";
    row += temp + "</div ></td><td><div class='col-md-2'></a><div class='rating'></div></div></td></tr>";
    row += "<tr><td colspan = '2'><div class='col-md-12'>";
    row += data.review + "</div ></td> </tr";
    //adjust the rate of it when created nvm wont work
    return row;
}

//create table body for hours
function createItem(data) {
    //console.log(data);
    var item = "<tr><td> " + data[0] + "</td><td>" + " " + data[1] + "</td></tr>";
   return item;
}

// Create an anchor tag with link to the address on google maps
function GetAddressAnchor(address) {
    var link = "https://www.google.com/maps/place/" + address.replace(" ", "+");
    var a = "<a href=\"" + link + "\">" + address.substr(0, address.indexOf(",")) + "</a>";
    return a;
}

//Get the Restaurant Data through a JSON Call
function getRestaurantData(urlID) {
    $.getJSON("restaurant-data", { id: urlID })
        .done(function (parsedResponse) {
            var res;
            //Received Response Text as JSON hopefully
            if (typeof parsedResponse === "string") {
                res = parsedResponse;
            }
            else {
                res = JSON.parse(JSON.stringify(parsedResponse)); //may be pointless operation as its already a JSON object response
            }

            
           
            //Restaurant Image
            UrlExists(res.image, function (status) {
                if (status === 200) {
                    $("#restImage").attr("src", res.image);
                }
                else if (status === 404) {
                    $("#restImage").attr("src", "../images/ss-logo -round.png");
                }
            });
            if (res.image == "" || (typeof(res.image) == 'undefined')) {
                $("#restImage").attr("src", "../images/ss-logo-round.png");
            }
            //Restaurant Name
            $("#restName").text(res.name);
            var website = res.website;
            if (website.slice(-1) == "/") {
                website = website.slice(0, -1);
            }
            var menu = res.menu;
            if (menu.slice(-1) == "/") {
                menu = menu.slice(0, -1);
            }
            $("#menu-link").append("<a href=" + menu + ">Menu</a>");
            $("#rest-link").append("<a href=" + website + ">Website</a>");

            var result = [];
            //convert JSON hours into array
            for (var i in res.hours) {
                result.push([i, res.hours[i]]);
            }

            console.log(result);
            $("#times").text(result[dayValue][0] + " " + result[dayValue][1]);
            $("#expanded-times").append("<tr><td style='font-weight: bold;'>" + result[dayValue][0] + "<td style='font-weight: bold;'>"
                + result[dayValue][1] + "</td></td></tr>");
            //look through all of the keys in hours
            var count = 0;
            Object.keys(res.hours).forEach(function (k) {
                if (k === day) {
                    count++;
                }
                else {
                    var item = createItem(result[count]);
                    //console.log(item);
                    $("#expanded-times").append(item);
                    count++;
                }
            });

            //Bio for restaurants
            $("#bio").text(res.desc);
            $("#address").append(GetAddressAnchor(res.address));
            $("#phone").text(res.phone);
            SetFilters(res.filters);

            //Get review data
            getReviewData(urlID);
        })
        .fail(function () {
            console.log("error");
            window.location.href = "/";
        })
        .always(function () {
            console.log("complete");
        });
}
function SetFilters(filters) {
    console.log(filters);
    if (filters["locally-owned"] == 1) {
        $(".house").attr("src", 'images/icons/house.png');
    }
    if (filters["minority-owned"] == 1) {
        $(".person").attr("src", 'images/icons/person.png');
    }
    if (filters["environmentally-friendly"] == 1) {
        $(".tree").attr("src", 'images/icons/tree.png');
    }
    if (filters["locally-sourced"] == 1) {
        $(".flower").attr("src", 'images/icons/flower.png');
    }if (filters["disability-friendly"] == 1) {
        $(".disability").attr("src", 'images/icons/disability.png');
    }
    if (filters["vegan-friendly"] == 1) {
        $(".carrot").attr("src", 'images/icons/carrot.png');
    }
    if (filters["disability-friendly"] == 1) {
        $(".disability").attr("src", 'images/icons/disability.png');
    }
}

//Get the Review Data through a JSON Call
function getReviewData(urlID) {

    //Test using 58c64e8b90ffbe4bcc94080e
    $.getJSON("review-data", { id: urlID })
        .done(function (parsedResponse) {

            var ratings = 0;
            var sum = 0;
            var avg = 0;
            var res;
            //Recievd Response Text as JSON hopefully
            if (typeof parsedResponse === 'string')
                res = parsedResponse;
            else {
                res = JSON.parse(JSON.stringify(parsedResponse)); //may be pointless operaton as its already a json object response
            }

            //reload json stuff here
            var len = res.length;
            var tbl = $("#review-list");
            $("#review-list tr").remove();

            //Create Table of Review List
            for (var data of res) {
                ratings++;
                var row = CreateRow(data);
                tbl.append(row);
                sum += data.rating;
                $(".rating").rate({
                    readonly: true,
                    initial_value: data.rating,
                    change_once: true,
                    selected_symbol_type: 'image2',
                    max_value: 5,
                    step_size: 1,
                    symbols: {
                        image2: {
                            base: '<div class="im"></div>',
                            hover: '<div class="im2"></div>',
                            selected: '<div class="im2"></div>',
                        },
                    },
                }); //needed for each appended rating
            }

            if (len == 0) {
                if ($("#review-none").css("display") == "none") {
                    document.getElementById("review-none").style.display = "block";
                }
            }
            else {
                document.getElementById("review-none").style.display = "none";
            }

            if (ratings != 0)
                avg = sum / ratings;

            $("#restStars").rate("setValue", avg);

        })
        .fail(function () {
            console.log("error");
        })
        .always(function () {
            console.log("complete");
        });
}


function updateRating(urlID, rating) {
    //Call ajax method to update restaurant
    $.ajax({
        url: "./update-rating",
        type: "POST",
        data: {id: urlID, rate: rating }
    }).done(function () {
        console.log("Rating Updated");
        //toastr.success("Rating Updated!");
    });
}


function UrlExists(url, cb) {
    jQuery.ajax({
        url: url,
        dataType: 'text',
        type: 'GET',
        complete: function (xhr) {
            if (typeof cb === 'function')
                cb.apply(this, [xhr.status]);
        }
    });
}