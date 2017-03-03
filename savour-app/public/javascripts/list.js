$(function () {
    var tbl = $("#dashboard-list");

    var data = [JSON.parse('{"name":"Curbside"}'),JSON.parse('{"name":"Tacobell"}'),JSON.parse('{"name":"McDonalds"}')];
    for (d of data) {
        var row = CreateRow(d);
        tbl.append(row);
    }
});

function CreateRow(data) {
    var row = "<tr><td><a><div class='cell-fill'>";
    row += data.name + "</div ></a ></td ></tr > ";
    return row;
}