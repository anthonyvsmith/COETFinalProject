"use strict";

$(document).ready(() =>
{
    //Create click handler to call 
    $('#submitActor').click(postActor);
});

function postActor()
{
    //Grab values from the text fields for first name, last name, and gender radio boxes
    let fname = $('#inputActorFName').val();
    let lname = $('#inputActorLName').val();
    let gender = $("input:radio[name ='genderRadio']:checked").val();

    //Send POST request to URL with JSON object as request content
    $.post("http://localhost:3000/Actors/createActor",
            {
                "first": fname,
                "last": lname,
                "gender": gender
            }
        );
}