
var tbl;
var filters = [];

function CreateRow(data) {
    if (data._id == null) 
        data._id = "";
    var row = "<tr><td><a href=./restaurant?id=" + data._id + "><div class='col-md-10'>";
    row += data.name + "</div ></td ><td><div class='col-md-2'>" + "<div class = 'rating'></div> "+ "</div></td></a></tr>";
    row += "<tr><td colspan = '2'><div class='col-md-12'>";
    row += data.desc + "</div ></td> </tr"; 
    return row;
}


$(function () 
{
    retrieveRestaurants();
});

function AddBubble(str) {
    if (!filters.includes(str)) {
        filters.push(str);
        clearDash();
        retrieveRestaurants();
        $("#bubble-bar").append("<div class='actionBox'>" + str + "</div>");

        $(".actionBox").click(function () {
            var index = filters.indexOf(this.innerText);
            if (index >= 0) {
                filters.splice(index, 1);
                this.remove();
                clearDash();
                retrieveRestaurants();
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

$(function () {
    $("#addFilter").click(function () {
        $("#hot-bar").toggle();
    });

    $("#filter-search").on('keyup', function (e) {
        if (e.keyCode == 13) {
            Search();
        }
    });
    $("#search-button").click(function () {
        Search();
    });

    $(".hotBox").click(function () {
        if (this.classList.contains("inactive")) {
            this.classList.remove("inactive")
        }
        else {
            this.classList.add("inactive")
        }
    });
});

function retrieveRestaurants() {

    filters = ["locally-owned", "minority-owned", "environmentally-friendly", "locally-sourced", "vegan-friendly", "disability-friendly"];
    tbl = $("#dashboard-list");
    // Get search data from server
    var jqxhr = $.getJSON("search-data", { filters: filters }, function () {
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
        console.log("res: ", res);
        //create bounds for each marker for right now
        var bounds = new google.maps.LatLngBounds();
        //var geometry = new google.maps.geometry;
        //console.log(geometry);
        for (d of res) {
            AddMarker(GooglePOS(d.location), d);
            bounds.extend(GooglePOS(d.location));
            map.fitBounds(bounds);
            var row = CreateRow(d);
            tbl.append(row);
            $('.rating').rate({ readonly: true, initial_value: d.rating, change_once: true }); //needed for each appended rating
        }
    });


}

function clearDash() {
    $("#dashboard-list tr").remove();
}