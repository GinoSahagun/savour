var tbl;
var tags = [];
var types = ["cafe","restaurant","bar"];
var mainFilters = [];
var restaurants = [];
var activeRestaurants = [];

function CreateRow(data) {
    if (data._id == null)
        data._id = "";
    var desc = data.desc;
    if (desc.length > 115) {
        desc = desc.substr(0, 115);
        desc += "... <a href=./restaurant?id=" + data._id + ">Read More</a>";
    }
    var row = "<tr><td><a href=./restaurant?id=" + data._id + "><div class='col-md-10 list-title'>";
    row += data.name + "</div ></td ><td><div class='col-md-2'>" + "<div class = 'rating'></div> " + "</div></td></a></tr>";
    row += "<tr><td colspan = '2'><div class='col-md-12 list-desc'>";
    row += desc + "</div ></td> </tr";
    return row;
}


$(function () {
    //Call initial retrieval of restaurants on page load
    retrieveRestaurants();
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-bottom-center",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "150",
        "hideDuration": "500",
        "timeOut": "2000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }

/*
 * Fix for footer when the keyboard is displayed
 */
    $(document).on('focus', 'input, textarea', function () {
        $(".navbar-fixed-bottom small-listbar").hide();
    });

    $(document).on('blur', 'input, textarea', function () {
        $(".navbar-fixed-bottom small-listbar").show();
    });

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
    val = val.toLowerCase();

    //Check to see if filter is in database, apply if found
    $.getJSON("filter-data", { name: val })
        .fail(function () {
            toastr.error("Tag does not exist, please try another one!");
            $("#filter-search").val("");
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
        if ($(window).width() <= 1000) {
            $("#map").css("height", "calc(100% - 250px)");
        } else {
            $("#map").css("height", "100%");
        }        
        google.maps.event.trigger(map, "resize");
        $("#map").css("margin-top", "30");
        map.fitBounds(bounds);
    }
    else {
        $("#map").css("margin-top", "470px");
        map.fitBounds(bounds);
        setTimeout(function () {
            $("#map").css("height", "calc(100% - 490px)");
            google.maps.event.trigger(map, "resize");
            map.panToBounds(bounds);
        }, 500);
    }
    $("#filter-menu").slideToggle();
    $(".navbar-fixed-bottom").toggleClass("min-listbar");
    // Notify maps that the size changed after its done changing sizes
    //map.fitBounds(bounds);
    setTimeout(function () {
        google.maps.event.trigger(map, "resize");
        //map.fitBounds(bounds);
    }, 500);
}

$(function () {
    $("#addFilter").click(function () {
        $("#addFilter").prop("disabled", true);
        ToggleScreen();
        ToggleListBarArrow();
        setTimeout(function () {
            $("#addFilter").prop("disabled", false);
            //map.fitBounds(bounds);
        }, 500);
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

function MatchingFilter(rest) {
    if (mainFilters.length <= 0) {
        return true;
    }
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
        if (!MatchingFilter(r)) {
            continue;
        }
        active.push(r);
    }
    return active;
}
function locs(distance, index) {
    this.dist = distance;
    this.index = index;
}
function sortLocations(locations) {
    locations.sort(function (l1, l2) {
        return l1.dist - l2.dist;
    });
}
//calculates distance between two points in km's
function calcDistance(p1, p2) {
    return parseInt((google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000).toFixed(2));
}
function UpdateRestaurants() {
    activeRestaurants = GetActive(restaurants);
    console.log("Active Restaurants: ", activeRestaurants);
    console.log(userMarker);
    clearDash();
    //create bounds for each marker for right now
    bounds = new google.maps.LatLngBounds();
    //var geometry = new google.maps.geometry;
    //console.log(geometry);
    var dist = [];
    var temp;
    var i = 0;
    var user = userMarker;
    ClearMarkers()
    bounds.extend(userMarker.position);
    // Extend the map bounds to fit all the restaurants
    for (d of activeRestaurants) {
        AddMarker(GooglePOS(d.location), d);
        bounds.extend(GooglePOS(d.location));
        if (user != null) {
            temp = calcDistance(userMarker.position, GooglePOS(d.location));
            var spot = new locs(temp, i);
            dist.push(spot);
            i++;
        }
        map.fitBounds(bounds);
        var row = CreateRow(d);
        tbl.append(row);
        $(".rating").rate({
            readonly: true,
            initial_value: d.rating,
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
    sortLocations(dist);
    console.log(dist);
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
        if (userMarker != null)
        console.log(userMarker.position);
        var dist = [];
        var temp;
        var i = 0;
        //create bounds for each marker for right now
        bounds = new google.maps.LatLngBounds();
        //var geometry = new google.maps.geometry;
        //console.log(geometry);
        for (d of activeRestaurants) {
            AddMarker(GooglePOS(d.location), d);
            if (userMarker != null) {
                temp = calcDistance(userMarker.position, GooglePOS(d.location));
                var spot = new locs(temp, i);
                dist.push(spot);
                i++;
            }
            bounds.extend(GooglePOS(d.location));
            map.fitBounds(bounds);
            var row = CreateRow(d);
            tbl.append(row);
            $(".rating").rate({
                readonly: true,
                initial_value: d.rating,
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
            }); //needed for each appended rating //needed for each appended rating
        }
        sortLocations(dist);
        console.log(dist);
        //console.log(markers);

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
        var src = $("." + filter + " img").attr("src").replace(".png", "-i.png");
        $("." + filter + " img").attr("src",src);
        mainFilters.splice(index, 1);
    } else {
        var src = $("." + filter + " img").attr("src").replace("-i.png", ".png");
        $("." + filter + " img").attr("src", src);
        mainFilters.push(filter);
    }
    UpdateRestaurants();
}

function ToggleType(type) {
    $("." + type).toggleClass("unselected");
    var index = types.indexOf(type);
    if (index >= 0) {
        var src = $("." + type + " img").attr("src").replace(".png", "-i.png");
        $("." + type + " img").attr("src", src);
        types.splice(index, 1);
    } else {
        var src = $("." + type + " img").attr("src").replace("-i.png", ".png");
        $("." + type + " img").attr("src", src);
        types.push(type);
    }
    UpdateRestaurants();
}

function ToggleListBar() {
    if ($(".navbar-fixed-bottom").is(".min-listbar")) {
        ToggleScreen();
        $(".navbar-fixed-bottom").toggleClass("small-listbar");
        ListArrowUp();
    } else {
        $(".navbar-fixed-bottom").toggleClass("small-listbar");
        if ($("#filter-menu").css("display") == "block") {
            $("#filter-menu").toggle();
        }
    }
    ToggleListBarArrow();
}

function ToggleListBarArrow() {
    if ($(".navbar-fixed-bottom").hasClass("small-listbar") || $(".navbar-fixed-bottom").hasClass("min-listbar")) {
        ListArrowUp();
    } else {
        ListArrowDown();
    }
}


function ListArrowUp() {
    $(".expand-bar img").attr("src", $(".expand-bar img").attr("src").replace("-down.png", ".png"));
}
function ListArrowDown() {
    if ($(".expand-bar img").attr("src").indexOf("-down.png") < 0) {
        $(".expand-bar img").attr("src", $(".expand-bar img").attr("src").replace(".png", "-down.png"));
    }
}