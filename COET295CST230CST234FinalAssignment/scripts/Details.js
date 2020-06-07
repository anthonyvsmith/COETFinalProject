"use strict";

$(document).ready(() =>
{
    //Get Actors to populate actor select element
    getActors();
});

function getActors()
{

    let actors = $.get("http://localhost:3000/Actors/getActors").responseJSON;

    let sHtml = "";
    console.log(actors);
    actors.forEach(function (actor)
    {
        sHtml += "<option>" + actor.FirstName + " " + actor.LastName + "</option>";
    });
    $('#actorList').html(sHtml);





}