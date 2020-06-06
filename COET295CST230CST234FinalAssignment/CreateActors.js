"use strict";

$(document).ready(() =>
{
    $('#submitName').click(displayName);
});

function displayName()
{
    let fname = $('#inputActorFName').val();
    let lname = $('#inputActorLName').val();
    let gender = $("input:radio[name ='genderRadio']:checked").val();
    console.log(fname + " " + lname + ": " + gender);
    alert(fname + " " + lname + ": " + gender);
}