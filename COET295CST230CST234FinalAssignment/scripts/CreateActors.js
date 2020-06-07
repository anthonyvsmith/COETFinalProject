"use strict";

$(document).ready(() =>
{
    //Create click handler to call 
    getActors();
    $('#submitActor').click(postActor);
});

function getActors()
{
    $.get("http://localhost:3000/Actors/all", function (response)
    {
        let sHtml = "";
        let count = 0;
        response.forEach(function (actor)
        {
            count++;
            sHtml += "<tr>";
            sHtml += "<th scope='row'>" + count + "</th>";
            sHtml += "<td>" + actor.FirstName + " " + actor.LastName + "</td>";
            sHtml += "<td>" + actor.Gender + "</td>";
            sHtml += "</tr>";
        });

        $('#actorTable').html(sHtml);
    });
}
function postActor()
{
    //Grab values from the text fields for first name, last name, and gender radio boxes
    let fname = $('#inputActorFName').val().trim();
    let lname = $('#inputActorLName').val().trim();
    let gender = $("input:radio[name ='genderRadio']:checked").val();

    if (fname.length <= 0 || lname.length <= 0 || gender == null || gender.length <= 0 || fname == "--Select an Actor--" || lname == "--Select an Actress--")
    {
        $('#createResult').removeClass("text-success");
        $('#createResult').addClass("text-danger");
        $('#createResult').text("Invalid entries in fields");
    }
    else
    {
        //Send POST request to URL with JSON object as request content
        $.post("http://localhost:3000/Actors/createActor", { "first": fname, "last": lname, "gender": gender },
            function (response)
            {
                $('#createResult').removeClass("text-danger");
                $('#createResult').addClass("text-success");
                $('#createResult').text(response);
                $('#inputActorFName').val('');
                $('#inputActorLName').val('');
                $("input:radio[name ='genderRadio']:checked").prop("checked", false);
                getActors();
            });
    }

}