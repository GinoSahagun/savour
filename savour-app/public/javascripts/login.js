// Below function Executes on click of login button.
function validate() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    window.location = "login-check?username=" + username + "&password=" + password;
}

$(function () {

    $("#password").keypress(function (e) {
        var key = e.which;
        if (key == 13) // the enter key code
        {
            $("#submit").click();
            return false;
        }
    });

});