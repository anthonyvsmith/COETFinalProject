"use strict";

$(document).ready(() =>
{
    //Get Actors to populate actor select element
    getActors();
    getMovies();
    $('#submitMovie').click(submitMovie);
});

function getMovies()
{
    $.get("http://localhost:3000/MovieDetails/movies", function (response)
    {
        let sHtml = "";
        let count = 0;
        response.forEach(function (movie)
        {
            count++;
            sHtml += "<tr>";
            sHtml += "<th scope='row'>" + count + "</th>";
            sHtml += "<td>" + movie.MovieName + "</td>";
            sHtml += "<td>" + movie.LeadActor + "</td>";
            sHtml += "<td>" + movie.LeadActress + "</td>";
            sHtml += "<td>" + movie.Rating + "</td>";
            sHtml += "</tr>";
        });

        $('#movieTable').html(sHtml);
    });
}

function submitMovie()
{
    let actor = $('#actorList').val();
    let actress = $('#actressList').val();
    let movieName = $('#movieName').val();

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
                $('#createResult').removeClass("text-danger");
                $('#createResult').addClass("text-success");
                $('#createResult').text(response);
                $('#movieName').val("");
                $('#actorList').val("--Select an Actor--");
                $('#actressList').val("--Select an Actress--");
                getMovies();
            });
    }

}

function getActors()
{
    //Send GET request to given URL with "m" tag for Male Actors
    $.get("http://localhost:3000/Actors/m",
         function (response)
         {
             //Create new select option for every actor in response
             let sHtml = $('#actorList').html();
             console.log(response);
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
            console.log(response);
            response.forEach(function (actor)
            {
                sHtml += "<option>" + actor.FirstName + " " + actor.LastName + "</option>";
            });

            //Set actressList HTML to option string
            $('#actressList').html(sHtml);
        });
}

function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}