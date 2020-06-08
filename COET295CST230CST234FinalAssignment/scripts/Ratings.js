"use strict";

$(document).ready(() =>
{
    getMovies();
    $('#submitRating').click(submitRating);
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
    let movie =
    {
        MovieName: $('#movieList').val()
    }
    let newRating = $('#inputRating').val();

    console.log(movie.MovieName + "\n" + newRating);

    $.get("http://localhost:3000/MovieRatings/Movie", movie, function (response)
    {
        console.log(response);
        newRating += parseInt(response.Rating);
        let newCount = response.Count + 1;

        $.post("http://localhost:3000/MovieRatings/Movie", { movieName: movie.MovieName, rating: newRating, ratingCount: newCount }, function (response)
        {
            var sHTML = "";
            let average = response.Rating / response.RatingCount;

            sHTML += "<tr>";
            sHTML += "<td>" + response.MovieName + "</td>";
            sHTML += "<td>" + average + "</td>";
            sHTML += "</tr>";

            $('#movieTable').html(sHTML);
        });
    });

    
}