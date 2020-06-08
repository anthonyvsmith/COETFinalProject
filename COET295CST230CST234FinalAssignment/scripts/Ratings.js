"use strict";

$(document).ready(() =>
{
    getMovies();
    $('#submitRating').click(submitRating);
    $('#movieList').change(function ()
    {
        $('#movieTable').html('');
        $('#createResult').removeClass("text-success");
        $('#createResult').removeClass("text-danger");
        $('#createResult').text("");
    });
})

function getMovies()
{
    $.get("http://localhost:3000/MovieDetails/movies", function (response)
    {
        let sHTML = $('#movieList').html();
        response.forEach(function (movie)
        {
            sHTML += "<option>" + movie.MovieName + "</option>";
        });

        $("#movieList").html(sHTML);
    });
}

function submitRating()
{
    let movieName = $('#movieList').val();
    let newRating = 0;
    let newCount = 0;
    let inputRating = $('#inputRating').val();

    if (inputRating <= 0 || inputRating > 100)
    {
        $('#createResult').removeClass("text-success");
        $('#createResult').addClass("text-danger");
        $('#createResult').text("Invalid rating. Must be between 1 and 100");
    }
    else
    {
        newRating += parseInt(inputRating);

        $.get("http://localhost:3000/MovieRatings/Movie/" + movieName, function (response)
        {
            newRating += parseInt(response[0].Rating);
            newCount = parseInt(response[0].RatingCount) + 1;

            $.post("http://localhost:3000/MovieRatings/Movie", { movieName: movieName, rating: newRating, ratingCount: newCount }, function (response)
            {
                var sHTML = "";
                let average = parseInt(response.Rating) / parseInt(response.RatingCount);

                sHTML += "<tr>";
                sHTML += "<td>" + response.MovieName + "</td>";
                sHTML += "<td>" + Math.round(average) + "</td>";
                sHTML += "<td>" + response.RatingCount + "</td>";
                sHTML += "</tr>";

                $('#movieTable').html(sHTML);

                $('#inputRating').val(50);
                $('#createResult').removeClass("text-danger");
                $('#createResult').addClass("text-success");
                $('#createResult').text("Successfully rated " + movieName + ": " + inputRating + "%");
            });
        });
    }


    
}