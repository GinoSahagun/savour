// Below function Executes on click of login button.
function validate() {
    var _username = document.getElementById("username").value;
    var _password = document.getElementById("password").value;

    var params = {username: _username, password: _password};

    $.getJSON("./login-check", params, function (data) {
        console.log(data);
        if (data.status >= 400) {
            console.log("Invalid login");
            $(".failedlogin").show();
        } else {
            window.location = "admin?secret=" + data.secret;
        }
    });
}

$(function () {

    $("#password").keypress(function (e) {
        var key = e.which;
        if (key == 13) { // the enter key code
            $("#submit").click();
            return false;
        }
    });

});