"use strict";
/*
 * Anthony Smith    CST230
 * Kyle Wei         CST234
 * Details.js
 * Handles JavaScript functionality for Details.html page
 */

$(document).ready(() =>
{
    //Get Actors to populate actor select element
    getActors();
    //Gets movies to populate movies table
    getMovies();

    //Click handler for Create Movie button. Calls submitMovie function
    $('#submitMovie').click(submitMovie);

    //Change handlers to clear errors if they exist
    $('#actorList').change(clearError);
    $('#actressList').change(clearError);
    $('#movieName').change(clearError);
});


//Helper function for clearing errors if an error is present
function clearError()
{
    if ($('#createResult').text().length > 0)
    {
        $('#createResult').removeClass("text-success");
        $('#createResult').removeClass("text-danger");
        $('#createResult').text("");
    }
}

//Gets an array of movies and creates table data rows for each one from DB
function getMovies()
{
    $.get("http://localhost:3000/MovieDetails/movies", function (response)
    {
        let sHtml = "";
        let count = 0;
        response.forEach(function (movie)
        {
            let average = 0;

            //Handles divide by 0 case
            if (movie.RatingCount > 0)
            {
                average = parseInt(movie.Rating) / parseInt(movie.RatingCount);
            }
            
            count++;
            sHtml += "<tr>";
            sHtml += "<th scope='row'>" + count + "</th>";
            sHtml += "<td>" + movie.MovieName + "</td>";
            sHtml += "<td>" + movie.LeadActor + "</td>";
            sHtml += "<td>" + movie.LeadActress + "</td>";
            sHtml += "<td>" + Math.round(average) + "</td>";
            sHtml += "</tr>";
        });

        $('#movieTable').html(sHtml);
    });
}

//Submits a movie entry to DB
function submitMovie()
{
    let actor = $('#actorList').val().trim();
    let actress = $('#actressList').val().trim();
    let movieName = $('#movieName').val().trim();

    //Error handling. If movie name, actor, actress is empty, or an invalid selection, display an error
    if (movieName.length <= 0 || actor.length <= 0 || actress.length <= 0 || $('#actorList').val() == "--Select an Actor--" || $('#actressList').val() == "--Select an Actress--")
    {
        $('#createResult').removeClass("text-success");
        $('#createResult').addClass("text-danger");
        $('#createResult').text("Invalid entries in fields");
    }
    else
    {
        let movie =
        {
            "movieName": movieName,
            "leadActor": actor,
            "leadActress": actress
        }

        //Send POST request to URL with JSON object as request content
        $.post("http://localhost:3000/MovieDetails", movie,
            function (response)
            {
                //Display success message and clear fields
                $('#createResult').removeClass("text-danger");
                $('#createResult').addClass("text-success");
                $('#createResult').text(response);
                $('#movieName').val("");
                $('#actorList').val("--Select an Actor--");
                $('#actressList').val("--Select an Actress--");

                //Query movies from DB to populate list
                //Not optimal method for performance
                getMovies();
            });
    }

}

//Gets a list of Actors to populate the Actor List
function getActors()
{
    //Send GET request to given URL with "m" tag for Male Actors
    $.get("http://localhost:3000/Actors/m",
         function (response)
         {
             //Create new select option for every actor in response
             let sHtml = $('#actorList').html();

             //Creates a new select optino for each actor
             response.forEach(function (actor)
             {
                 sHtml += "<option>" + actor.FirstName + " " + actor.LastName + "</option>";
             });

             //Set actorList HTML to option string
             $('#actorList').html(sHtml);
        });

    //Send GET request to given URL with "f" tag for Female Actresses
    $.get("http://localhost:3000/Actors/f",
        function (response)
        {
            //Create new select option for every actress in response
            let sHtml = $('#actressList').html();

            response.forEach(function (actor)
            {
                sHtml += "<option>" + actor.FirstName + " " + actor.LastName + "</option>";
            });

            //Set actressList HTML to option string
            $('#actressList').html(sHtml);
        });
}
