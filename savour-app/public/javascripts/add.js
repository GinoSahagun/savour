// JS File for adding a new Restaurant etc. to the database.
var filters = ["locally-owned", "minority-owned", "environmentally-friendly", "locally-sources", "vegan-friendly", "disability-friendly"];
var geocoder;

function GetDayJSON(day) {
    var response = "\"" + day + "\": \"";
    response += $("#" + day.toLowerCase() + "-open").val() + "-";
    response += $("#" + day.toLowerCase() + "-close").val() + "\"";
    return response;
}

function GetHours() {
    var hrs = "{";
    hrs += GetDayJSON("SUN") + ",";
    hrs += GetDayJSON("MON") + ",";
    hrs += GetDayJSON("TUE") + ",";
    hrs += GetDayJSON("WED") + ",";
    hrs += GetDayJSON("THU") + ",";
    hrs += GetDayJSON("FRI") + ",";
    hrs += GetDayJSON("SAT");
    hrs += "}";
    return hrs;
}

function GetLatLon() {
    var response = "{ \"LAT\": \"" + $("#lat").val() + "\", \"LON\": \"" + $("#lon").val() + "\"}";
    return response;
}

function RestaurantClass() {
    this.name = $("#name").val();
    this.phone = $("#phone").val();
    this.hours = GetHours();
    this.pricing = $("#priceRating").rate("getValue");
    this.rating = $("#starRating").rate("getValue");
    this.address = $("#address").val();
    this.location = GetLatLon();
    this.desc = $("#desc").val();
    this.website = $("#website").val();
    this.menu = $("#menu").val();
}

function calcLoc() {
    var address = $("#address").val();
    geocoder.geocode({ "address": address, componentRestrictions: {administrativeArea: "WA", country: "US"}}, function (results, status) {
        if (status == "OK") {
            console.log("LAT LON calculated");
            $("#address").val(results[0].formatted_address);
            $("#lat").val(results[0].geometry.location.lat());
            $("#lon").val(results[0].geometry.location.lng());
            $("#location-div").show();
            $("#addressButton").text("Update Location");
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}

function submitform() {
    var rest = new RestaurantClass();
    var filterStr = filters.toString();
    console.log(rest);
    calcLoc();

    $.ajax({
        url: "./add",
        type: "POST",
        data: JSON.parse(JSON.stringify(rest)),
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("could not post data");
            window.alert("Could not add Restaurant");
        },
        success: function () {
            $.ajax({
                url: "./filters-add",
                type: "POST",
                data: { rest: JSON.parse(JSON.stringify(rest)), filter: filterStr}
            }).done(function () {
                console.log("Filters Added");
                window.location = "./..";
            });
        }
    }).done(function () {
        window.location = "./..";
    });
}

$(function () {
    //set up Hour pickers
    $(".timepicker").timepicker({
        timeFormat: "h:mm p",
        interval: 30,
        minTime: "12am",
        maxTime: "11:59pm",
        defaultTime: "10",
        startTime: "12am",
        dynamic: false,
        dropdown: true,
        scrollbar: true
    });

    // Setup geocoder
    geocoder = new google.maps.Geocoder();

    //set up for price rating
    var options = {
        max_value: 5,
        step_size: 1
    };
    //set up for price rating
    $("#priceRating").rate(options);

    //set up for rating stars
    $("#starRating").rate(options);

    $("#submitButton").click(function () {
        submitform();
    });
    $("#addressButton").click(function () {
        calcLoc();
    });
});

$(function () {
    $("#filter-button").click(function () {
        $("#hot-bar-add").toggle();
    });
    $("#search-button").click(function () {
        var val = $("#filter-search").val();
        AddBubble(val);
        $("#filter-search").val("");

        $.ajax({
            url: "./addFilter",
            type: "POST",
            data: { filter: val }            
        }).done(function () {
            console.log(val + " added to database");
        });
    });

    $(".hotBox").click(function () {
        var filt = this.innerHTML.toLowerCase().replace(" ", "-");
        if (this.classList.contains("inactive")) {
            this.classList.remove("inactive");
            filters.push(filt);
        }
        else {
            this.classList.add("inactive");            
            filters.splice(filters.indexOf(filt), 1);
        }
    });
});

function AddBubble(str) {
    if (!filters.includes(str)) {
        filters.push(str);
        $("#bubble-bar").append("<div class='actionBox'>" + str + "</div>");

        $(".actionBox").click(function () {
            filters.splice(filters.indexOf(str), 1);
            this.remove();
        });
    }
}