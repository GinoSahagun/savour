var tbl;
var tags = [];
var types = ["cafe","restaurant","bar"];
var mainFilters = ["locally-owned", "minority-owned", "environmentally-friendly", "locally-sourced", "vegan-friendly", "disability-friendly"];
var restaurants = [];
var activeRestaurants = [];

function CreateRow(data) {
    if (data._id == null)
        data._id = "";
    var row = "<tr><td><a href=./restaurant?id=" + data._id + "><div class='col-md-10'>";
    row += data.name + "</div ></td ><td><div class='col-md-2'>" + "<div class = 'rating'></div> " + "</div></td></a></tr>";
    row += "<tr><td colspan = '2'><div class='col-md-12'>";
    row += data.desc + "</div ></td> </tr";
    return row;
}


$(function () {
    //Call initial retrieval of restaurants on page load
    retrieveRestaurants();
});

function AddBubble(str) {
    var taggg = str.replace(" ", "-").toLowerCase();
    if (!tags.includes(taggg)) {
        tags.push(taggg);
        clearDash();    //clear restaurant list
        retrieveRestaurants();  //get new restaurants with applied tags
        $("#bubble-bar").append("<div class='actionBox'>" + str + "</div>");

        // Remove tag
        $(".actionBox").click(function () {
            var index = tags.indexOf(this.innerText.replace(" ", "-").toLowerCase());
            if (index >= 0) {
                tags.splice(index, 1);
                this.remove();
                clearDash();    //clear restaurant list
                retrieveRestaurants();  //get new restaurants with applied tags
            }
        });
    }
}

function Search() {
    var val = $("#filter-search").val();

    //Check to see if filter is in database, apply if found
    $.getJSON("filter-data", { name: val })
        .fail(function () {
            window.alert("Could not find filter, please try a different one.");
        })
        .always(function () {
            console.log("Complete");
        })
        .done(function () {
            //Found filter, add to applied filters
            AddBubble(val);
            $("#filter-search").val("");
        });
}

function ToggleScreen() {
    if ($("#filter-menu").css("display") == "block") {
        $("#map").css("height", "calc(100% - 250px)");
        $("#map").css("margin-top", "30");
    }
    else {
        $("#map").css("height", "calc(100% - 490px)");
        $("#map").css("margin-top", "470px");
    }
    $("#filter-menu").slideToggle();
    $(".navbar-fixed-bottom").slideToggle();
    // Notify maps that the size changed after its done changing sizes
    setTimeout(function () {
        google.maps.event.trigger(map, "resize");
    }, 500);
}

$(function () {
    $("#addFilter").click(function () {
        ToggleScreen();
    });

    $("#filter-search").on("keyup", function (e) {
        if (e.keyCode == 13) {
            Search();
        }
    });
    $("#search-button").click(function () {
        Search();
    });

    $(".hotBox").click(function () {
        if (this.classList.contains("inactive")) {
            this.classList.remove("inactive");
            mainFilters.push(this.innerText);
        }
        else {
            this.classList.add("inactive");
            var index = mainFilters.indexOf(this.innerText.replace(" ", "-").toLowerCase());
            if (index >= 0) {
                mainFilters.splice(index, 1);
                // TODO filtrrrr rests in dsaved from last daters query
            }
        }
    });
});

function matchingFilter(rest) {
    if (rest.filters["locally-owned"] == "1" && mainFilters.indexOf("locally-owned") >= 0) {
        return true;
    }
    if (rest.filters["minority-owned"] == "1" && mainFilters.indexOf("minority-owned") >= 0) {
        return true;
    }
    if (rest.filters["environmentally-friendly"] == "1" && mainFilters.indexOf("environmentally-friendly") >= 0) {
        return true;
    }
    if (rest.filters["locally-sourced"] == "1" && mainFilters.indexOf("locally-sourced") >= 0) {
        return true;
    }
    if (rest.filters["vegan-friendly"] == "1" && mainFilters.indexOf("vegan-friendly") >= 0) {
        return true;
    }
    if (rest.filters["disability-friendly"] == "1" && mainFilters.indexOf("disability-friendly") >= 0) {
        return true;
    }
    return false;
}

function GetActive(rest){
    var active = [];
    for (r of rest) {
        if (types.indexOf(r.type) < 0) {
            continue;
        }
        if (!matchingFilter(r)) {
            continue;
        }
        active.push(r);
    }
    return active;
}

function UpdateRestaurants() {
    activeRestaurants = GetActive(restaurants);
    console.log("Active Restaurants: ", activeRestaurants);
    clearDash();
    //create bounds for each marker for right now
    var bounds = new google.maps.LatLngBounds();
    //var geometry = new google.maps.geometry;
    //console.log(geometry);
    for (d of activeRestaurants) {
        AddMarker(GooglePOS(d.location), d);
        bounds.extend(GooglePOS(d.location));
        map.fitBounds(bounds);
        var row = CreateRow(d);
        tbl.append(row);
        $(".rating").rate({ readonly: true, initial_value: d.rating, change_once: true }); //needed for each appended rating
    }
}

function retrieveRestaurants() {
    tbl = $("#dashboard-list");
    // Get search data from server
    var jqxhr = $.getJSON("search-data", { tags: tags }, function () {
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

    jqxhr.done(function (parsedResponse, statusText, jqXhr) {
        var res;
        // Check for valid
        if (typeof parsedResponse === 'object')
            res = parsedResponse;
        else {
            res = JSON.parse(JSON.stringify(parsedResponse)); //may be pointless operation as its already a json object response
        }
        console.log("second complete");
        restaurants = res;
        activeRestaurants = GetActive(res);
        console.log("Active Restaurants: ", activeRestaurants);

        //create bounds for each marker for right now
        var bounds = new google.maps.LatLngBounds();
        //var geometry = new google.maps.geometry;
        //console.log(geometry);
        for (d of activeRestaurants) {
            AddMarker(GooglePOS(d.location), d);
            bounds.extend(GooglePOS(d.location));
            map.fitBounds(bounds);
            var row = CreateRow(d);
            tbl.append(row);
            $(".rating").rate({ readonly: true, initial_value: d.rating, change_once: true }); //needed for each appended rating
        }
    });


}

function clearDash() {
    $("#dashboard-list tr").remove();
}

function ToggleFilter(filter) {
    filter = filter.replace(" ", "-").toLowerCase();
    $("." + filter).toggleClass("unselected");
    var index = mainFilters.indexOf(filter);
    if (index >= 0) {
        mainFilters.splice(index, 1);
    } else {
        mainFilters.push(filter);
    }
    UpdateRestaurants();
}

function ToggleType(type) {
    $("." + type).toggleClass("unselected");
    var index = types.indexOf(type);
    if (index >= 0) {
        types.splice(index, 1);
    } else {
        types.push(type);
    }
    UpdateRestaurants();
}

function ToggleListBar() {
    $(".navbar-fixed-bottom").toggleClass("small-listbar");
    if ($("#filter-menu").css("display") == "block") {
        $("#filter-menu").toggle();
    }
}