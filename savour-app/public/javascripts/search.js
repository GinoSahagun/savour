
//var ObjectId = require('mongodb').ObjectId; //create instance of Object ID
//Document Ready Function
//function load for span tags
$(function () {
    $(".admin-drop").click(function () {
        console.log("clicked");
        console.log($(this));
    });

    // Assign handlers immediately after making the request,
    // and remember the jqxhr object for this request
    // Get Json from Search Data get Function 
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

    // Set another completion function for the request above
    jqxhr.done(function (parsedResponse, statusText, jqXhr) {
        var res;
        //Recievd Response Text as JSON hopefully
        if (typeof parsedResponse === 'string')
            res = parsedResponse;
        else {
            res = JSON.parse(JSON.stringify(parsedResponse)); //may be pointless operation as its already a json object response
        }
        console.log("second complete");

        //reload json stuff here
        console.log("res: " , res); //check to see if object was working

        var tbl = $("#dashboard-list"); //table id from html selector
  
        for (d of res) {
            var row = CreateRow(d);
            tbl.append(row);
        }
    });
});

  function CreateRow(data) {
            var row = "<tr>";
            row +="<td><a><div class=\"cell-fill\">" + data.name + "</div></a></td>";
            row += "<td>" + data.address + "</td>";
            row += "<td>" + data.rating + "</td>";
            row += "<td><button class=\"btn btn-primary btn-right admin-drop\">View</button></td>";
            row += "</tr>";
            return row;
        }