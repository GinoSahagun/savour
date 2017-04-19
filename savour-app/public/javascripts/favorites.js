$(function () {

    //Load local data here


    //Call retrieval of restaurants using local data
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
                data.image = "images/brandon.jpg";
            var rest = "<div class=\"col-sm-3 fav-rest\"><a href=./restaurant?id=" + data._id + ">" + "<img class=\"img-circle img-favorites\" src=\"" + data.image + "\"";
            rest += "<h3><center>" + data.name + "</center></h3></a>";
            rest+= "</div>";
            return rest;
        }

    });
});