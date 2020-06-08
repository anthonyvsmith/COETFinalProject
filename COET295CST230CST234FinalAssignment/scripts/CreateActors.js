/*
 * Anthony Smith    CST230
 * Kyle Wei         CST234
 * CreateActors.js
 * Handles JavaScript functionality for createActors.html page
 */

"use strict";

$(document).ready(() =>
{
    //Calls getActors function to query DB for list of actors
    getActors();
    //Create click handler to call postActor when button is clicked
    $('#submitActor').click(postActor);

    //Change handlers to clear any errors
    $('#inputActorFName').change(clearError);
    $('#inputActorLName').change(clearError);
    $("input:radio[name ='genderRadio']").change(clearError);
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

//Sends GET request to controller to get an array of all actors in DB
//Processes returned array and creates table rows for each entry
function getActors()
{
    $.get("http://localhost:3000/Actors/all", function (response)
    {
        let sHtml = "";
        let count = 0;

        //Iterates through the returned actors and creates a new table data element for each
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

//Sends POST request to controller to create a new actor
function postActor()
{
    //Grab values from the text fields for first name, last name, and gender radio boxes
    let fname = $('#inputActorFName').val().trim();
    let lname = $('#inputActorLName').val().trim();
    let gender = $("input:radio[name ='genderRadio']:checked").val();

    //Error checking for empty fields, or invalid selections. Displays an error message
    if (fname.length <= 0 || lname.length <= 0 || gender == null || gender.length <= 0)
    {
        $('#createResult').removeClass("text-success");
        $('#createResult').addClass("text-danger");
        $('#createResult').text("Invalid entries in fields");
    }
    else
    {
        //Send GET request for the entered actor/actress
        $.get("http://localhost:3000/Actors/" + fname + "/" + lname + "/" + gender, function (response)
        {
            //Error Handling for if entered actor/actress already exists in the DB
            if (response.length > 0)
            {
                $('#createResult').removeClass("text-success");
                $('#createResult').addClass("text-danger");
                let sError = ""

                if (gender == "Male")
                {
                    sError = fname + " " + lname + " (M) already exists"
                }
                else
                {
                    sError = fname + " " + lname + " (F) already exists"
                }

                $('#createResult').text(sError);
            }
            else
            {
                //Send POST request to URL with JSON object as request content
                $.post("http://localhost:3000/Actors/createActor", { "first": fname, "last": lname, "gender": gender },
                    function (response)
                    {
                        //Displays a success message and clears field entries if POSt is successful
                        $('#createResult').removeClass("text-danger");
                        $('#createResult').addClass("text-success");
                        $('#createResult').text(response);
                        $('#inputActorFName').val('');
                        $('#inputActorLName').val('');
                        $("input:radio[name ='genderRadio']:checked").prop("checked", false);

                        //Requeries for actors to update list
                        //Not optimal method for performance, but it gets the job done
                        getActors();
                    });
            }
        });

    }

}