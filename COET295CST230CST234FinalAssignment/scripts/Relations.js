"use strict";

$(document).ready(() =>
{
    getActors();
    $('#actorList').change(getRelations);
});

function getRelations()
{
    let name = $('#actorList').val();
    if (name !== "--Select an Actor--")
    {
        let spName = name.split(' ');
        let firstName = spName[0];
        let lastName = spName[1];

        $.post("http://localhost:3000/ActorRelations", { firstName: firstName, lastName: lastName }, function (response)
        {
            let sHtml = "";
            let count = 0;
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

function getActors()
{
    //Send GET request to given URL with "m" tag for Male Actors
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