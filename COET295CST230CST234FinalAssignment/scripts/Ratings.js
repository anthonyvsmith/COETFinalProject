"use strict";
/*
 * Anthony Smith    CST230
 * Kyle Wei         CST234
 * Ratings.js
 * Handles JavaScript functionality for Ratings.html page
 */
$(document).ready(() =>
{
    //Get movies to populate movie list
    getMovies();

    //Sets click handler for Rate Movie button
    $('#submitRating').click(submitRating);

    //Clears response messages if selected movie changes
    $('#movieList').change(function ()
    {
        $('#movieTable').html('');
        $('#createResult').removeClass("text-success");
        $('#createResult').removeClass("text-danger");
        $('#createResult').text("");
    });
})

//Gets movies from DB to populate Movie List
function getMovies()
{
    $.get("http://localhost:3000/MovieDetails/movies", function (response)
    {
        let sHTML = $('#movieList').html();

        //Creates a new select option for each movie returned
        response.forEach(function (movie)
        {

            sHTML += "<option>" + movie.MovieName + "</option>";
        });

        $("#movieList").html(sHTML);
    });
}

//Handles submitting a new rating for a movie
function submitRating()
{
    
    let movieName = $('#movieList').val();
    let newRating = 0;
    let newCount = 0;
    let inputRating = $('#inputRating').val();

    //Check if entered rating is outside of bounds, display error
    if (inputRating <= 0 || inputRating > 100)
    {
        $('#createResult').removeClass("text-success");
        $('#createResult').addClass("text-danger");
        $('#createResult').text("Invalid rating. Must be between 1 and 100");
    }
    else
    {
        newRating += parseInt(inputRating);

        //Send a get request for the given movie
        $.get("http://localhost:3000/MovieRatings/Movie/" + movieName, function (response)
        {
            //Get new rating by adding current rating to old rating
            newRating += parseInt(response[0].Rating);

            //Get new total number of ratings
            newCount = parseInt(response[0].RatingCount) + 1;

            //POSt updated movie information
            $.post("http://localhost:3000/MovieRatings/Movie", { movieName: movieName, rating: newRating, ratingCount: newCount }, function (response)
            {
                var sHTML = "";
                //Create table data entry for the movie displaying the new average rating and number of ratings
                let average = parseInt(response.Rating) / parseInt(response.RatingCount);

                sHTML += "<tr>";
                sHTML += "<td>" + response.MovieName + "</td>";
                sHTML += "<td>" + Math.round(average) + "</td>";
                sHTML += "<td>" + response.RatingCount + "</td>";
                sHTML += "</tr>";

                $('#movieTable').html(sHTML);

                //Reset entry values and display a success message
                $('#inputRating').val(50);
                $('#movieList').val("--Select a Movie--");
                $('#createResult').removeClass("text-danger");
                $('#createResult').addClass("text-success");
                $('#createResult').text("Successfully rated " + movieName + ": " + inputRating + "%");
            });
        });
    }


    
}