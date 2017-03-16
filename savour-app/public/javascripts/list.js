/*
$(function () {
    var tbl = $("#dashboard-list");

    var data = [JSON.parse('{"name":"Curbside", "rating": "****", "desc": "Fairly quick, super cheap, and very very delicious. Staff is very friendly! Definitely a new lunch spot!","id":"58be70523ef171a24f518ab0"}'), JSON.parse('{"name":"El Camion", "rating": "****", "desc": "Fairly quick, super cheap, and very very delicious. Staff is very friendly! Definitely a new lunch spot!", "id":"58b9c9a4bd72fa71b8ba1dad"}'), JSON.parse('{"name":"McDonalds", "rating": "****", "desc": "Fairly quick, super cheap, and very very delicious. Staff is very friendly! Definitely a new lunch spot!"}')];

    for (d of data) {
        var row = CreateRow(d);
        tbl.append(row);
    }
});*/

var tbl;

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
    tbl = $("#dashboard-list");
    // Get search data from server
    var jqxhr = $.getJSON("search-data", function () {
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

        for (d of res) {
            AddMarker(GooglePOS(d.location));
            var row = CreateRow(d);
            tbl.append(row);
            $('.rating').rate({ readonly: true, initial_value: d.rating, change_once: true }); //needed for each appended rating
        }
    });

});


