// JS File for adding a new Restaurant etc. to the database.
var filters = ["locally-owned", "minority-owned", "environmentally-friendly", "locally-sourced", "vegan-friendly", "disability-friendly"];
var geocoder;

function GetDayJSON(day) {
    var response = "\"" + day + "\": \"";
    response += $("#" + day.toLowerCase() + "-open").val() + "-";
    response += $("#" + day.toLowerCase() + "-close").val() + "\"";
    return response;
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

function RestaurantClass() {
    this.name = $("#name").val();
    this.phone = $("#phone").val();
    this.hours = GetHours();
    this.pricing = $("#priceRating").rate("getValue");
    this.rating = $("#starRating").rate("getValue");
    this.address = $("#address").val();
    this.location = GetLatLon();
    this.desc = $("#desc").val();
    this.website = $("#website").val();
    this.menu = $("#menu").val();
    this.image = "";
}
//currently global variable need to figuresomething else out
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
    var filterStr = filters.toString();
    if (!(validatePhone())) {
        toastr.error("Verify Phone Number");
        $("#phone").focus();
        return false;
    }
    calcLoc();
    if (flag) {
    //Image Upload + rest.image link
    if ($("#uploaded").attr('src') != "")
       rest.image = $("#uploaded").attr('src');
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
                    data: { rest: JSON.parse(JSON.stringify(rest)), filter: filterStr }
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
        toastr.error("Restaurant Not Added Please Verify Address");
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
        defaultTime: "10",
        startTime: "12am",
        dynamic: false,
        dropdown: true,
        scrollbar: true
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
        cloud_name: 'savoursip', api_key: '738137753563181'
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

    //set up for rating stars
    $("#starRating").rate(options);

    $("#submitButton").click(function () {
        submitform();
    });
    $("#addressButton").click(function () {
     calcLoc();
    });
});

$(function () {
    $("#filter-button").click(function () {
        $("#hot-bar-add").toggle();
    });
    $("#search-button").click(function () {
        var val = $("#filter-search").val();
        AddBubble(val);
        $("#filter-search").val("");

        $.ajax({
            url: "./addFilter",
            type: "POST",
            data: { filter: val }            
        }).done(function () {
            console.log(val + " added to database");
        });
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
});

function AddBubble(str) {
    if (!filters.includes(str)) {
        filters.push(str);
        $("#bubble-bar").append("<div class='actionBox'>" + str + "</div>");

        $(".actionBox").click(function () {
            filters.splice(filters.indexOf(str), 1);
            this.remove();
        });
    }
}
//Image Upload Functions 
window.ajaxSuccess = function () {
    var $body = $("body");
    response = JSON.parse(this.responseText);
    console.log("ajaxSuccess", typeof this.responseText);
    document.getElementById('uploaded').setAttribute("src", response["secure_url"]);
    document.getElementById('uploaded').setAttribute("src", response["secure_url"]);
    document.getElementById('results').innerText = "Image Preview";
    console.log(response.secure_url);
    toastr.success("Image Uploaded to Cloud");
    $body.removeClass("loading");

}
window.AJAXSubmit = function (formElement) {
    console.log("starting AJAXSubmit");
    var $body = $("body");
    if (!formElement.action) { return; }
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


//Prview Image
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#uploaded').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}
