var map;
var infoWindow;
var userMarker;
var marks = [];

function initMap() {
    var omh = { lat: 47.651395, lng: -122.361466 };

    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(function (position) {
            var userPos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var blueMarker = "../images/blue-marker.png";
            if (userMarker == null) {
                userMarker = new google.maps.Marker({
                    position: userPos,
                    map: map,
                    icon: blueMarker,
                    title: "You are here"
                });
                map.setCenter(userPos);
            } else {
                userMarker.setPosition(userPos);
            }
        });
    }

    var mapStyle = [
        {
            featureType: "administrative",
            elementType: "labels",
            stylers: [
                { visibility: "off" }
            ]
        }, {
            featureType: "poi",
            elementType: "labels",
            stylers: [
                { visibility: "off" }
            ]
        }/*, {
            featureType: "water",
            elementType: "labels",
            stylers: [
                { visibility: "off" }
            ]
        }, {
            featureType: "road",
            elementType: "labels",
            stylers: [
                { visibility: "off" }
            ]
        }*/
    ];

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: omh,
        disableDefaultUI: true,
        mapTypeId: "mapStyle",
        gestureHandling: 'greedy'
    });
    map.mapTypes.set("mapStyle", new google.maps.StyledMapType(mapStyle, { name: "Map Style" }));
    google.maps.event.addListener(map, "click", function () {
        if (infoWindow != null) {
            infoWindow.close();
        }
    });

}

// Converts the JSON object we're using in mongodb to a google latlng
function GooglePOS(jsonPos) {
    try {
        var pos = new google.maps.LatLng(jsonPos.LAT, jsonPos.LON);
        return pos;
    }
    catch (err) {
        console.error(err);
        return new google.maps.LatLng();
    }
}

function AddMarker(pos, rest) {
    // TODO validation
    //Create Html Part of Info Windows
    var contentString = '<div id="content">' +
        '<div id="siteNotice">' +
        '</div>' +
        '<h5 id="firstHeading" style="white-space: nowrap;" class="firstHeading"><a href=./restaurant?id=' + rest._id + '>' + rest.name + '<a/> </h5>' +
        '<div id="bodyContent">' +
        '<p>' + rest.address + '</p>' +
        '<p><a href=' + rest.website + '>' + rest.name + 's Website' + '</a>' + '</p>' +
        '</div class="row" >' +
        "<img style='width:100px; height: 100px; id='popWin' src=" + rest.image + ">" +
        '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });
    var marker = new google.maps.Marker({
        position: pos,
        map: map
    });
    google.maps.event.addListener(marker, 'click', (function (marker) {
        return function () {
            infowindow.open(map, marker);
        }
    })(marker));

    var listener = google.maps.event.addListener(map, "idle", function () {
        google.maps.event.removeListener(listener);
    });
    marks.push(marker);

}
