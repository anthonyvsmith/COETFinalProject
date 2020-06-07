"use strict";

$(document).ready(() =>
{
    //Get Actors to populate actor select element
    getActors();
    $('#submitMovie').click(submitMovie);
});

function submitMovie()
{
    let actor = $('#actorList').val();
    let actress = $('#actressList').val();
    let movieName = $('#movieName').val();

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
            console.log(response);
            $('#createResult').text(response);
        });
}

function getActors()
{
    //Send GET request to given URL with "m" tag for Male Actors
    $.get("http://localhost:3000/Actors/m",
         function (response)
         {
             //Create new select option for every actor in response
             let sHtml = "";
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
            let sHtml = "";
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