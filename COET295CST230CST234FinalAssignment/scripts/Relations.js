"use strict";
/*
 * Anthony Smith    CST230
 * Kyle Wei         CST234
 * Relations.js
 * Handles JavaScript functionality for Relations.html page
 */

$(document).ready(() =>
{
    //Gets a list of actors to fill actor list
    getActors();

    //When actor list changes, get the relations
    $('#actorList').change(getRelations);
});

//Gets related actors to the selected actor
function getRelations()
{
    let name = $('#actorList').val();
    //Only execute code if valid actor is chosen
    if (name !== "--Select an Actor--")
    {
        //Split name on the space. ASSUMING ACTORS/ACTRESSES ONLY HAVE ONE SPACE IN NAME FOR SIMPLICITY
        let spName = name.split(' ');
        let firstName = spName[0];
        let lastName = spName[1];

        //Send POSt request with given actor/actress
        $.post("http://localhost:3000/ActorRelations", { firstName: firstName, lastName: lastName }, function (response)
        {
            let sHtml = "";
            let count = 0;
            //Process response actors and create table records for each
            response.forEach(function (relation)
            {
                count++;
                sHtml += "<tr>";
                sHtml += "<th scope='row'>" + count + "</th>";
                sHtml += "<td>" + relation.Name + "</td>";
                sHtml += "<td>" + relation.Gender + "</td>";
                sHtml += "</tr>";
            });

            $('#relationTable').html(sHtml);
        });
    }


}

//Gets an array of ALL actors
function getActors()
{
    //Send GET request to given URL
    $.get("http://localhost:3000/Actors/all",
        function (response)
        {
            //Create new select option for every actor in response
            let sHtml = $('#actorList').html();
            response.forEach(function (actor)
            {
                sHtml += "<option>" + actor.FirstName + " " + actor.LastName + "</option>";
            });

            //Set actorList HTML to option string
            $('#actorList').html(sHtml);
        });
}