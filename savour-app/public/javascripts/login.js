// Below function Executes on click of login button.
function validate() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    $.ajax({
        url: "./login-check",
        type: "GET",
        data: { username: username, password: password }
    }).done(function (data) {
        if (data == true) {
            window.location = "admin"; // Successful login. Redirecting to other page.
        }
        else {
            alert("Incorrect, please try again.");
        }

    });
}