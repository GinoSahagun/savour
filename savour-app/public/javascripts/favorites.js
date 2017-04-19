$(function () {

    //Load local data here
    var favRestaurants;
    //Check to see if browser supports storage
    if (typeof (Storage) !== "undefined") {
        //Check to see if there is already an array with saved data
        if (localStorage.getItem("favRestaurants") != null) {
            favRestaurants = JSON.parse(localStorage.getItem("favRestaurants"));

            //Call retrieval of restaurants using local data
            var jqxhr = $.getJSON("favorites-get", { favRestaurants }, function () {
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
                //Recievd Response Text as JSON hopefully
                if (typeof parsedResponse === "string") {
                    res = parsedResponse;
                } else {
                    res = JSON.parse(JSON.stringify(parsedResponse)); //may be pointless operation as its already a json object response
                }

                for (d of res) {
                    var newRest = CreateRest(d);
                    $("#faves").append(newRest);
                }

                function CreateRest(data) {
                    if (data.image == undefined || data.image == "undefined")
                        data.image = "images/ss-logo-round.png";
                    var rest = "<div class=\"col-md-3 fav-rest\"><a href=./restaurant?id=" + data._id + ">" + "<img class=\"img-circle img-favorites\" src=\"" + data.image + "\"";
                    rest += "<h3><center>" + data.name + "</center></h3></a>";
                    rest += "</div>";
                    return rest;
                }

            });
        }
        else {
            //No favorites saved yet!
            $("#faves").append("<h2> No Favorites saved! Go find a restaurant and select the heart in the upper right-hand corner! </h2>");
        }
    }
    else {
        $("#faves").append("<h2> We're really sorry, but your browser does not support favorites.</h2>");
    }

});