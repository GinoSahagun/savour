// JS File for adding a new Restaurant etc. to the database.
var filters = [];
var tags = [];
var geocoder;

function GetDayJSON(day) {
    var response = "\"" + day + "\": \"";
    response += $("#" + day.toLowerCase() + "-open").val() + "-";
    response += $("#" + day.toLowerCase() + "-close").val() + "\"";
    return response;
}
function firstTimeSelection(day, hrs) {
    $("#" + day.toLowerCase() + "-open").val(hrs + " AM");
    $("#" + day.toLowerCase() + "-close").val(hrs + " PM");
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

function GetLatLon() {
    var response = "{ \"LAT\": \"" + $("#lat").val() + "\", \"LON\": \"" + $("#lon").val() + "\"}";
    return response;
}

function GetFilters() {
    var a = [((filters.indexOf("locally-owned") >= 0) ? "1" : "0"),
        ((filters.indexOf("minority-owned") >= 0) ? "1" : "0"),
        ((filters.indexOf("environmentally-friendly") >= 0) ? "1" : "0"),
        ((filters.indexOf("locally-sourced") >= 0) ? "1" : "0"),
        ((filters.indexOf("vegan-friendly") >= 0) ? "1" : "0"),
        ((filters.indexOf("disability-friendly") >= 0) ? "1" : "0")];
    var f = "{ \"locally-owned\" : \"" + a[0] + "\",";
    f += "\"minority-owned\" : \"" + a[1] + "\",";
    f += "\"environmentally-friendly\" : \"" + a[2] + "\",";
    f += "\"locally-sourced\" : \"" + a[3] + "\",";
    f += "\"vegan-friendly\" : \"" + a[4] + "\",";
    f += "\"disability-friendly\" : \"" + a[5] + "\"}";
    return f;
}

function RestaurantClass() {
    this.name = $("#name").val();
    this.phone = $("#phone").val();
    this.hours = JSON.parse(GetHours());
    this.pricing = $("#price").val();
    this.filters = JSON.parse(GetFilters());
    this.type = $("#restType option:selected").text();
    this.address = $("#address").val();
    this.location = JSON.parse(GetLatLon());
    this.desc = $("#desc").val();
    this.website = $("#website").val();
    this.menu = $("#menu").val();
    this.id = getUrlParameter('id');
    this.image = "";
}
//currently global variable need to figure something else out
var flag;

function calcLoc() {
    var address = $("#address").val();
    //empty address box is no bueno
    if (address == "") {
        return false;
    }

    geocoder.geocode({ "address": address, componentRestrictions: { administrativeArea: "WA", country: "US" } }, function (results, status) {
        if (status == "OK") {
            console.log(results.length);
            //validate by if the user finds more queries return false if its only one and not Washington then its a true address
            if (results[0].formatted_address == "Washington, USA" || results.length > 1) {
                flag = false;
                return false;
            }
            console.log(results);
            console.log("LAT LON calculated");
            $("#address").val(results[0].formatted_address);
            $("#lat").val(results[0].geometry.location.lat());
            $("#lon").val(results[0].geometry.location.lng());
            $("#location-div").show();
            $("#addressButton").text("Update Location");
            flag = true;
            return true;
        }
        else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
    return true;
}

function submitform() {
    var rest = new RestaurantClass();
    if (!(validatePhone())) {
        toastr.error("Enter Valid Phone Number");
        $("#phone").focus();
        return false;
    }
    if (filters.length <= 0) {
        toastr.error("Please Select at least one Filter. Green == Selected");
        $("#hot-bar-add").toggle();
        return false;
    }
    calcLoc();
    if (flag) {
        //Image Upload + rest.image link
        if ($("#uploaded").attr('src') != "") {
            rest.image = $("#uploaded").attr('src');
        }
        //tags.push($("#restType option:selected").text());
        var tagsOut = tags.toString();
        console.log(rest);
        var rest2 = JSON.parse(JSON.stringify(rest));
        //Add Restaurant Data
        $.ajax({
            url: "./update-restaurant",
            type: "POST",
            data: rest2,
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("could not post data");
                window.alert("Could not update restaurant");
            },
            success: function () {
                $.ajax({
                    url: "./filters-add",
                    type: "POST",
                    data: { rest: JSON.parse(JSON.stringify(rest)), tags: tagsOut }
                }).done(function () {
                    toastr.success("Filters Updated", function () {
                        console.log("Filters Updated");
                        window.location = "./admin";
                    });
                });
            }
        }).done(function () {
            toastr.success("Restaurant Updated", function () {
                window.location = "./admin";
            });

        });
    }
    else {
        toastr.error("Please Verify Address");
        $("#address").focus();
    }
}
function validatePhone() {
    var reg = "^\\((\\d{3})\\)\\s(\\d{3})-(\\d{4})$";
    var regex = new RegExp(reg, "gm");
    var temp = $("#phone").val()
    return regex.test(temp);
}

$(function () {
    var restID = getUrlParameter('id');

    if (restID) {
        getRestaurantData(restID);
        //getReviewData(restID);
    }
    else {
        //Pop Up a status message
        //redirect to home page if no ID was passed
        window.location.href = "/";
    }

    //Loading GIF
    $body = $("body");

    $(window).ajaxStart(function () {
        $body.addClass("loading");
    });
    $(window).ajaxStop(function () {
        $body.removeClass("loading");
    });

    //set up Hour pickers
    $(".timepicker").timepicker({
        timeFormat: "h:mm p",
        interval: 30,
        minTime: "12am",
        maxTime: "11:59pm",
        defaultTime: "7",
        startTime: "12am",
        dynamic: true,
        dropdown: true,
        scrollbar: true,
    });

    //Automation of Timers
    $("#sun-open").timepicker("option", "change", function (time) {
        // update startTime option in all time pickers

        $.confirm({
            title: "Copy Hours?",
            backgroundDismiss: false,
            type: "green",
            backgroundDismissAnimation: "glow",
            content: "Copy Hours Into Other Time Inputs?",
            buttons: {
                confirm: function () {
                    var hrs = $("#sun-open").val().split(" ");
                    console.log(hrs);
                    firstTimeSelection("SUN", hrs[0]);
                    firstTimeSelection("MON", hrs[0]);
                    firstTimeSelection("TUE", hrs[0]);
                    firstTimeSelection("WED", hrs[0]);
                    firstTimeSelection("THU", hrs[0]);
                    firstTimeSelection("FRI", hrs[0]);
                    firstTimeSelection("SAT", hrs[0]);
                },
                cancel: function () { }
            }
        });
    });

    //re-format
    $("#phone").focusout(function () {
        var temp = $(this).val();
        if ($("#phone").val().length == 10) {
            temp = temp.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
            $("#phone").val(temp);
        }
    });

    // Configure Cloudinary
    // with credentials available on
    // your Cloudinary account dashboard
    $.cloudinary.config({
        cloud_name: "savoursip", api_key: "738137753563181"
    });

    $("#upload-file").change(function () {
        readURL(this);
    });

    //Set up Toast
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-bottom-center",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "500",
        "timeOut": "2000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
    // Setup geocoder
    geocoder = new google.maps.Geocoder();

    //set up for price rating
    var options = {
        max_value: 5,
        step_size: 1
    };
    //set up for price rating
    $("#priceRating").rate(options);

    $("#saveButton").click(function () {
        submitform();
    });
    $("#addressButton").click(function () {
        calcLoc();
    });
});

function Search() {
    var val = $("#filter-search").val();
    AddBubble(val);
    $("#filter-search").val("");

    $.ajax({
        url: "./addFilter",
        type: "POST",
        data: { tag: val }
    }).done(function () {
        console.log(val + " added to database");
    });
}

// On Page Load
$(function () {
    $("#addFilter").click(function () {
        $("#hot-bar-add").toggle();
    });
    $("#search-button").click(function () {
        Search();
    });

    $(".hotBox").click(function () {
        var filt = this.innerHTML.toLowerCase().replace(" ", "-");
        if (this.classList.contains("inactive")) {
            this.classList.remove("inactive");
            filters.push(filt);
        }
        else {
            this.classList.add("inactive");
            filters.splice(filters.indexOf(filt), 1);
        }
    });
    $("#filter-search").on("keyup", function (e) {
        if (e.keyCode == 13) {
            Search();
        }
    });
});

function AddBubble(str) {
    if (!tags.includes(str)) {
        tags.push(str);
        $("#bubble-bar").append("<div class='actionBox'>" + str + "</div>");

        $(".actionBox").click(function () {
            var index = tags.indexOf(this.innerText);
            if (index >= 0) {
                tags.splice(index, 1);
                this.remove();
            }
        });
    }
}
//Image Upload Functions
window.ajaxSuccess = function () {
    var $body = $("body");
    response = JSON.parse(this.responseText);
    console.log("ajaxSuccess", typeof this.responseText);
    document.getElementById("uploaded").setAttribute("src", response["secure_url"]);
    document.getElementById("uploaded").setAttribute("src", response["secure_url"]);
    document.getElementById("results").innerText = "Image Preview";
    console.log(response.secure_url);
    toastr.success("Image Uploaded to Cloud");
    $body.removeClass("loading");

}
window.AJAXSubmit = function (formElement) {
    console.log("starting AJAXSubmit");
    var $body = $("body");
    var input = $("#upload-file")
    console.log(input[0].files);
    if (!(formElement.action)) {
        toastr.error("Please Select an Image");
        return;
    }
    if (input[0].files.length == 0) {
        toastr.error("Please Select an Image");
        return;
    }
    // Initiate upload to cloudairy account
    var form = $("#imageForm");
    var formData = form[0];
    console.log("starting AJAXSubmit");
    var xhr = new XMLHttpRequest();
    xhr.onload = ajaxSuccess;
    xhr.open("post", "https://api.cloudinary.com/v1_1/savoursip/image/upload");
    xhr.send(new FormData(formData));
    $body.addClass("loading");
}


//Preview Image
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $("#uploaded").attr("src", e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

function getRestaurantData(urlID) {
    $.getJSON("restaurant-data", { id: urlID })
        .done(function (parsedResponse) {
            var res;
            //Received Response Text as JSON hopefully
            if (typeof parsedResponse === "string") {
                res = parsedResponse;
            }
            else {
                res = JSON.parse(JSON.stringify(parsedResponse)); //may be pointless operation as its already a JSON object response
            }

            //Restaurant Name
            $("#name").val(res.name);
            $("#phone").val(res.phone);

            //Fill in hours fields
            var result = [];
            //convert JSON hours into array
            for (var i in res.hours) {
                var openHours = res.hours[i].substring(0, 7);
                var closedHours = res.hours[i].substring(8);
                result.push(openHours);
                result.push(closedHours);
            }
            $("#sun-open").val(result[0]);
            $("#sun-close").val(result[01]);
            $("#mon-open").val(result[2]);
            $("#mon-close").val(result[3]);
            $("#tue-open").val(result[4]);
            $("#tue-close").val(result[5]);
            $("#wed-open").val(result[6]);
            $("#wed-close").val(result[7]);
            $("#thu-open").val(result[8]);
            $("#thu-close").val(result[9]);
            $("#fri-open").val(result[10]);
            $("#fri-close").val(result[11]);
            $("#sat-open").val(result[12]);
            $("#sat-close").val(result[13]);

            $("#price").val(res.pricing);
            $("#address").val(res.address);
            $("#desc").val(res.desc);
            $("#website").val(res.website);
            $("#menu").val(res.menu);

            $("#upload-file").text(res.image);
            $("#uploaded").attr("src", res.image);

            $("#restType").val(res.type);

            //Fill in filters bar
            setFilters(res);

        })
        .fail(function () {
            console.log("error");
        })
        .always(function () {
            console.log("complete");
        });
}
function setFilters(rest) {
    if (rest.filters["locally-owned"] == "1") {
        filters.push("locally-owned");
        $(".hotbox")[0].className = "hotbox"
    }
    if (rest.filters["minority-owned"] == "1") {
        filters.push("minority-owned");
        $(".hotbox")[1].className = "hotbox"
    }
    if (rest.filters["environmentally-friendly"] == "1") {
        filters.push("environmentally-friendly");
        $(".hotbox")[2].className = "hotbox"
    }
    if (rest.filters["locally-sourced"] == "1") {
        filters.push("locally-sourced"); 
        $(".hotbox")[3].className = "hotbox"
    }
    if (rest.filters["vegan-friendly"] == "1") {
        filters.push("vegan-friendly");
        $(".hotbox")[4].className = "hotbox"
    }
    if (rest.filters["disability-friendly"] == "1") {
        filters.push("disability-friendly");
        $(".hotbox")[5].className = "hotbox"
    }
}
