$(function () {
    var tbl = $("#dashboard-list");

    var data = [JSON.parse('{"name":"Curbside", "rating": "****", "desc": "Fairly quick, super cheap, and very very delicious. Staff is very friendly! Definitely a new lunch spot!"}'), JSON.parse('{"name":"Tacobell", "rating": "****", "desc": "Fairly quick, super cheap, and very very delicious. Staff is very friendly! Definitely a new lunch spot!"}'), JSON.parse('{"name":"McDonalds", "rating": "****", "desc": "Fairly quick, super cheap, and very very delicious. Staff is very friendly! Definitely a new lunch spot!"}')];

    for (d of data) {
        var row = CreateRow(d);
        tbl.append(row);
    }
});

function CreateRow(data) {
    var row = "<tr><td><div class='col-md-10'>";
    row += data.name + "</div ></td ><td><div class='col-md-2'>" + data.rating + "</div></td></tr>";
    row += "<tr><td colspan = '2'><div class='col-md-12'>";
    row += data.desc + "</div ></td> </tr"; 
    return row;
}