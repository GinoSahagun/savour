//var ObjectId = require("mongodb").ObjectId; //create instance of Object ID
//Document Ready Function
var userPos, UserPosition;
var dist = [];

function initMap() {
    //Google API requires this
}

$(function () {
    // Assign handlers immediately after making the request,
    // and remember the jqxhr object for this request
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(function (position) {
            userPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            $.getJSON("neighborhood-data")
                .fail(function () {
                    //Default to Queen Anne
                    //Neighborhood name
                    $("#neighborhoodName").text("Could not load current neighborhood. Please try again later. ");
                })
                .always(function () {
                    console.log("Complete");
                }).done(function (parsedResponse, statusText, jqXhr) {
                    var res;
                    //Recievd Response Text as JSON
                    if (typeof parsedResponse === Object) {
                        res = parsedResponse;
                    } else {
                        res = JSON.parse(JSON.stringify(parsedResponse)); //may be pointless operaton as its already a json object response
                    }
                    console.log("Second complete");
                    var i = 0;
                    for (d of res) {
                        if (userPos != null) {
                            var restPos = new google.maps.LatLng(Number(d.location.LAT), Number(d.location.LON));
                            temp = calcDistance(userPos, restPos);
                            var spot = new locs(temp, i);
                            dist.push(spot);
                            i++;
                        }
                    }

                    sortLocations(dist);
                    res = SortNeighborhoods(res, dist);

                    //Neighborhood name
                    $("#neighborhoodName").text(res[0].name);
                    //Neighborhood bio
                    $("#neighborhoodBio").text(res[0].desc);

                });
        });
    } else {
        window.alert("Turn on Geolocation!");
    }

});

function sortLocations(locations) {
    locations.sort(function (l1, l2) {
        return l1.dist - l2.dist;
    });
}
//calculates distance between two points in km's
function calcDistance(p1, p2) {
    return parseInt((google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000).toFixed(2));
}

function locs(distance, index) {
    this.dist = distance;
    this.index = index;
}

function SortNeighborhoods(neighborhoods, dist) {
    var sortedNeighborhoods = [];
    for (d of dist) {
        sortedNeighborhoods.push(neighborhoods[d.index]);
    }
    return sortedNeighborhoods;
}