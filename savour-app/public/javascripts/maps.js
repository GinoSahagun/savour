function initMap() {
    // OMH: 47.651395, -122.361466
    var omhLat = 47.651395;
    var omhLon = -122.361466;
    var pos1 = new google.maps.LatLng(omhLat, omhLon);
    var pos2 = new google.maps.LatLng(omhLat + .004, omhLon + .008);
    var pos3 = new google.maps.LatLng(omhLat - .008, omhLon - .0075);
    var pos4 = new google.maps.LatLng(omhLat + .009, omhLon - .0073);
    var pos5 = new google.maps.LatLng(omhLat - .0085, omhLon + .0041);

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: pos1
    });
    var marker1 = new google.maps.Marker({
        position: pos1,
        map: map
    });
    var marker2 = new google.maps.Marker({
        position: pos2,
        map: map
    });
    var marker3 = new google.maps.Marker({
        position: pos3,
        map: map
    });
    var marker4 = new google.maps.Marker({
        position: pos4,
        map: map
    });
    var marker5 = new google.maps.Marker({
        position: pos5,
        map: map
    });
}