//JS file to gather neighborhood data and display it
$(document).ready(function () {

    //function load for span tags
    $(function () {
        //Neighborhood name
        $('#neighborhoodName').text("Queen Anne");
        //Neighborhood city
        $("#neighborhoodCity").text("Seattle");
        //Neighborhood population
        $("#neighborhoodPop").text("28,000");
        //Neighborhood bio
        $("#neighborhoodBio").text("Queen Anne Hill is an affluent neighborhood and geographic feature in Seattle, northwest of downtown. The neighborhood sits on the highest named hill in the city, with a maximum elevation of 456 feet (139 m). It covers an area of 7.3 square kilometers (2.8 sq mi), and has a population of about 28,000. Queen Anne is bordered by Belltown to the south, Lake Union to the east, the Lake Washington Ship Canal to the north and Interbay to the west. The hill became a popular spot for the city's early economic and cultural elite to build their mansions, and the name derives from the architectural style typical of many of the early homes.");
        //Neighborhood image
        $('#neighborhoodImg').attr('src', 'images/queenanne.jpg');

    });



});