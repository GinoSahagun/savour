
//var ObjectId = require('mongodb').ObjectId; //create instance of Object ID
//Document Ready Function
$(document).ready(function () {

    //function load for span tags
    $(function () {

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

            console.log("res: " ,res); //check to see if object was working

            var tbl = $("#dashboard-list"); //table id from html selector
            var tr = "<tr>"; //table row html 
            var td = "<td>"; //table data cell html tag

            for (d of res) {
                var row = CreateRow(d);
                tbl.append(row);
            }


            function CreateRow(data) {
                var row = "<tr><td><a><div class='cell-fill'>";
                row += data.name + "<td>" + data.address + "<td>" + data.rating + "</div ></a ></td ></td></td></tr > ";
                return row;
            }
        });
       
    });



});