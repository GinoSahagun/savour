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

function ValidateHREF(site){
    if (site.indexOf("http://") < 0 && site.indexOf("https://") < 0) {
        site = "http://" + site;
    }
    return site;
}

//function to validate all hours + ensure the times
function valHours(day) {

    var open = $("#" + day.toLowerCase() + "-open").val();
    var close = $("#" + day.toLowerCase() + "-close").val();
    var reg = (/(\d{1,2}):(\d{2})\s([AP][M])/);
    var dayOpen = $("#" + day.toLowerCase() + "-open");
    var dayClose = $("#" + day.toLowerCase() + "-close");
    var stuff = dayOpen;
    var Regex = new RegExp(reg);

    if (Regex.test(open) && Regex.test(close)) {
        open = open.split(" ");
        close = close.split(" ");
        if (open[1] == close[1]) {
            open = open[0].split(":");
            close = close[0].split(":");
            if (parseInt(close[0]) <= parseInt(open[0])) {
                dayClose.focus();
                //dayClose.click();
                toastr.error("Please Verify Close Time");
                return false;
            }
            else
                return true;

        }
        else
            return true;
    }
    else if (!Regex.test(open)) {
        dayOpen.focus();
        toastr.error("Please Verify Hours");
        return false;
    }
    else if (!Regex.test(close)) {
        dayClose.focus();
        toastr.error("Please Verify Hours");
        return false;
    }


}
//Wrapper function to validate all hours + ensure the times
function wrapperValHours() {

    if (valHours("SUN") && valHours("MON") && valHours("TUE") && valHours("WED") && valHours("THU") && valHours("FRI") && valHours("SAT"))
        return true;
    else
        return false;
}

function RestaurantClass() {
    this.name = $("#name").val();
    this.phone = $("#phone").val();
    this.hours = GetHours();
    this.pricing = $("#priceRating").rate("getValue");
    this.filters = GetFilters();
    this.type = $("#restType option:selected").text();
    this.rating = $("#starRating").rate("getValue");
    this.address = $("#address").val();
    this.location = GetLatLon();
    this.desc = $("#desc").val();
    this.website = ValidateHREF($("#website").val());
    this.menu = ValidateHREF($("#menu").val());
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
    //Valid Checker
    if (!wrapperValHours()) {
        return false;
    }
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
        if ($("#uploaded").attr("src") != "") {
            rest.image = $("#uploaded").attr("src");
        }
        if (rest.image == "" || typeof (rest.image) == "undefined") {
            rest.image = "../images/ss-logo-round.png";
        }
        //Restaurant Image
        UrlExists(rest.image, function (status) {
            if (status === 200) {
                rest.image = $("#uploaded").attr("src");
            }
            else if (status === 404) {
                rest.image = "../images/ss-logo-round.png";
            }
        });
        //tags.push($("#restType option:selected").text());
        var tagsOut = tags.toString();
        console.log(rest);
        //Add Restaurant Data
        $.ajax({
            url: "./add",
            type: "POST",
            data: JSON.parse(JSON.stringify(rest)),
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("could not post data");
                window.alert("Could not add Restaurant");
            },
            success: function () {
                $.ajax({
                    url: "./filters-add",
                    type: "POST",
                    data: { rest: JSON.parse(JSON.stringify(rest)), tags: tagsOut }
                }).done(function () {
                    toastr.success("Filters Added", function () {
                        console.log("Filters Added");
                        window.location = "./..";
                    });
                });
            }
        }).done(function () {
            toastr.success("Restaurant Added", function () {
                window.location = "./..";
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

    //re-format phone number
    $("#phone").focusout(function () {
        var temp = $(this).val();
        if ($("#phone").val().length == 10) {
            temp = temp.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
            $("#phone").val(temp);
        }
    });

    $("#website").focusout(function () {
        $("#website").val(ValidateHREF($("#website").val()));
    });
    $("#menu").focusout(function () {
        $("#menu").val(ValidateHREF($("#menu").val()));
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
        selected_symbol_type: 'image2',
        max_value: 5,
        step_size: 1,
        symbols: {
            image2: {
                base: '<div class="im"></div>',
                hover: '<div class="im2"></div>',
                selected: '<div class="im2"></div>',
            },
        },
    };
    //set up for price rating
    $("#priceRating").rate(options);

    //set up for rating stars
    $("#starRating").rate(options);

    $("#submitButton").click(function () {
        submitform();
        return false;
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
function UrlExists(url, cb) {
    jQuery.ajax({
        url: url,
        dataType: 'text',
        type: 'GET',
        complete: function (xhr) {
            if (typeof cb === 'function')
                cb.apply(this, [xhr.status]);
        }
    });
}