// JS File for adding a new Restaurant etc. to the database.
$(function () {
    $("#submitButton").click(function () {
        submitform();
    });
});

function submitform() {
    var rest = new RestaurantClass();
    console.log(rest);
}

function RestaurantClass(){
    this.name = $("#name").val();
    this.phone = $("#phone").val();
    this.hours = JSON.parse(GetHours());
    this.pricing = $("#pricing").val();
    this.rating = $("#rating").val();
    this.address = $("#address").val();
    this.location = JSON.parse(GetLatLon());
    this.desc = $("#desc").val();
    this.website = $("#website").val();
    this.menu = $("#menu").val();
    this.green = $("#green").is(':checked')
    this.local = $("#local").is(':checked')
    this.ownership = $("#ownership").is(':checked')
    this.vegan = $("#vegan").is(':checked')
    this.ada = $("#ada").is(':checked')
}

function GetHours() {
    var hrs = "{";
    hrs += GetDayJSON("SUN") + ",";
    hrs += GetDayJSON("MON") + ",";
    hrs += GetDayJSON("TUE") + ",";
    hrs += GetDayJSON("WED") + ",";
    hrs += GetDayJSON("THU") + ",";
    hrs += GetDayJSON("FRI") + ",";
    hrs += GetDayJSON("SAT");
    hrs += "}";
    return hrs;
}

function GetDayJSON(day) {
    var response = "\"" + day + "\": \"";
    response += $("#" + day.toLowerCase() + "-open").val() + "-";
    response += $("#" + day.toLowerCase() + "-close").val() + "\"";
    return response;
}

function GetLatLon() {
    var response = "{ \"LAT\": \"" + $("#lat").val() + "\", \"LON\": \"" + $("#lon").val() + "\"}";
    return response;
}