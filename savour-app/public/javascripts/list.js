$(function () {
    var tbl = $("#dashboard-list");

    var data = [JSON.parse('{"name":"Curbside", "rating": "****", "desc": "Fairly quick, super cheap, and very very delicious. Staff is very friendly! Definitely a new lunch spot!","id":"58be70523ef171a24f518ab0"}'), JSON.parse('{"name":"El Camion", "rating": "****", "desc": "Fairly quick, super cheap, and very very delicious. Staff is very friendly! Definitely a new lunch spot!", "id":"58b9c9a4bd72fa71b8ba1dad"}'), JSON.parse('{"name":"McDonalds", "rating": "****", "desc": "Fairly quick, super cheap, and very very delicious. Staff is very friendly! Definitely a new lunch spot!"}')];

    for (d of data) {
        var row = CreateRow(d);
        tbl.append(row);
    }
});

function CreateRow(data) {
    if (data.id == null) 
        data.id = "";
    var row = "<tr><td><a href=./restaurant?id=" + data.id + "><div class='col-md-10'>";
    row += data.name + "</div ></td ><td><div class='col-md-2'>" + data.rating + "</div></td></a></tr>";
    row += "<tr><td colspan = '2'><div class='col-md-12'>";
    row += data.desc + "</div ></td> </tr"; 
    return row;
}