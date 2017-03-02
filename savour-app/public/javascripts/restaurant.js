
//Document Ready Function
$(document).ready(function () {

    //function load for span tags
    $(function () {
    //source image
        $('#restImage').attr('src', 'images/curbside.jpg');
        //Restaurant Name
        $("#restName").text("Curbside");
        //Restuaran Rating Stars
        $("#restStars").text("5");
        //Start Time
        $("#startHour").text("10:00am");
        //End Time
        $("#endHour").text("9:00pm");
        $("#bio").text("Fairly quick, super cheap, and very very delicious. Staff is very friendly!  Definetly a new lunch spot!👍"); 
    });



});