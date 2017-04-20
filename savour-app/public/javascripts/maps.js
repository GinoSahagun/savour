var map;
var infoWindow;
var selectedMarker;
var userMarker;
var markers = [];
var bounds;
var blueMarker = "../images/icons/marker-b.png";
var greenMarker = "../images/icons/marker-g.png";
var orangeMarker = "../images/icons/marker-o.png";

function initMap() {
    var omh = { lat: 47.651395, lng: -122.361466 };

    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(function (position) {
            var userPos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };            
            if (userMarker == null) {
                userMarker = new google.maps.Marker({
                    position: userPos,
                    map: map,
                    icon: blueMarker,
                    title: "You are here"
                });
                bounds.extend(userMarker.position);
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
        }
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
        UnSelectMarker();
    });
    bounds = new google.maps.LatLngBounds();
}

function UnSelectMarker() {
    if (infoWindow != null) {
        infoWindow.close();
    }
    if (selectedMarker != null) {
        selectedMarker.setIcon(greenMarker);
    }
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
function ClearMarkers() {
    var mtest;
    while (markers.length > 0) {
        mtest = markers.pop();
        mtest.setMap(null);
    }
}

function GetAddressAnchor(address) {
    var link = "https://www.google.com/maps/place/" + address.replace(" ", "+");
    var a = "<a href=\"" + link + "\">" + address.substr(0, address.indexOf(",")) + "</a>";
    return a;
}
function AddMarker(pos, rest) {
    // TODO validation
    //Create Html Part of Info Windows
    //console.log(rest);

    var o_id = rest.id;

    if (o_id == "" || typeof (o_id) == "undefined") {
        o_id = rest._id;
    }
    if (rest.image == "" || (typeof (rest.image) == 'undefined')) {
        rest.image = "../images/ss-logo-round.png";
    }
    var contentString = '<div id="info-window">' +
        '<div id="siteNotice">' +
        "<img class='iwImg' id='popWin' src=" + rest.image + ">" +
        '</div>' +
        '<h5 id="firstHeading" style="white-space: nowrap;" class="firstHeading"><a href=./restaurant?id=' + o_id + '>' + rest.name + '<a/> </h5>' +
        '<div id="bodyContent">' +
        '<p>' + GetAddressAnchor(rest.address) + '</p>' +
        '<p><a href=' + rest.website + '>' + 'Website' + '</a>' + '</p>' +
        '</div class="row" ></div>';
    
    infoWindow = new google.maps.InfoWindow({
        content: contentString
    });
    var marker = new google.maps.Marker({
        position: pos,
        map: map,
        icon: greenMarker
    });
    //console.log(marker.position);
    google.maps.event.addListener(marker, 'click', (function (marker) {
        return function () {
            UnSelectMarker();
            infoWindow.open(map, marker);
            infoWindow.setContent(contentString);
            $(".gm-style-iw").next().toggle();            
            selectedMarker = marker;
            marker.setIcon(orangeMarker);
        }
    })(marker));

    var listener = google.maps.event.addListener(map, "idle", function () {
        google.maps.event.removeListener(listener);
    });
    markers.push(marker);

}
