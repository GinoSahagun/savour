var map;
var infoWindow;
var userMarker;
var filters = [];

function initMap() {
    filters.push("food", "coffee", "tea");
    var omh = { lat:47.651395, lng:-122.361466};

    var marks = [omh,
        { lat: omh.lat + .004, lng: omh.lng + .008 },
        { lat: omh.lat - .008, lng: omh.lng - .0075 },
        { lat: omh.lat + .009, lng: omh.lng - .0073 },
        { lat: omh.lat + .0085, lng: omh.lng + .0041 },
    ];

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
                    title: 'You are here'
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
        zoom: 15,
        center: omh,
        disableDefaultUI: true,
        mapTypeId: 'mapStyle'
    });
    map.mapTypes.set('mapStyle', new google.maps.StyledMapType(mapStyle, { name: 'Map Style' }));
    google.maps.event.addListener(map, 'click', function () {
        if (infoWindow != null) {
            infoWindow.close();
        }
    });

    for (mark of marks) {
        AddMarker(mark);
    }
}

function AddMarker(pos) {
    new google.maps.Marker({
        position: pos,
        map: map
    });
}

function AddBubble(str) {
    if (!filters.includes(str)) {
        filters.push(str);
        $("#bubble-bar").append("<div class='actionBox'>" + str + "</div>");
    }
}

$(function () {
    $("#filter-button").click(function () {
        if (filters.length != 0) {
            $("#bubble-bar").toggle();
        }
    });
    $("#search-button").click(function () {
        // TODO: Brandon put code her plz
    });
});