'use strict';
/*
 * Anthony Smith    CST230
 * Kyle Wei         CST234
 * app.js
 * Provides controller routing and responses for incoming requests
 */

//Imports for various modules and files
var CRUD = require("./scripts/CRUD.js");
var express = require('express');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var PORT = 3000;

//Constants for referencing CRUD queries
const estCon = CRUD.estCon;
const addActor = CRUD.createActor;
const selectActors = CRUD.selectActors;
const selectMovies = CRUD.selectMovies;
const createMovie = CRUD.createMovie;
const updateMovie = CRUD.updateMovie;

//Setting cluster to clusterCST234
estCon("clusterCST234");
//Including scripts folder to gain access to script files
app.use(express.static('scripts'));

//App route for serving Create Actors page
app.get("/", (req, res) =>
{
    res.sendFile(path.join(__dirname + "/CreateActors.html"));
});

//App route for serving Create Actors page
app.get("/Actors", (req, res) =>
{
    res.sendFile(path.join(__dirname + "/CreateActors.html"));
});

//Handles GET request to return a list of all actors sorted by first name
app.get("/Actors/all", (req, res) =>
{
    //Query DB for all actors
    selectActors({}).then(result =>
    {
        //Sort resulting array in ascending alphabetical order
        result.sort(function (a, b)
        {
            return a.FirstName.localeCompare(b.FirstName);
        });
        res.send(result);
    })
});

//Handles GET request for a specific actor/actress. Checks all fields to ensure exact match
app.get("/Actors/:fname/:lname/:gender", (req, res) =>
{
    //Pulling parameters from request URL
    let FirstName = req.params.fname;
    let LastName = req.params.lname;
    let Gender = req.params.gender;

    //Querying DB for specific actor/actress
    selectActors({ FirstName: FirstName, LastName: LastName, Gender: Gender }).then(result =>
    {
        res.send(result);
    });
});

//POST route for inserting an actor into the database
app.post("/Actors/createActor", (req, res) =>
{
    //Creating temporary 
    let fname = req.body.first;
    let lname = req.body.last;
    let gender = req.body.gender;

    addActor({ FirstName: fname, LastName: lname, Gender: gender }).then(result => {
        res.send(result);
    });
});

//GET route for getting only actors, or only actresses from the database
//Switches depending on the parameter passed in (m or f)
app.get("/Actors/:gender", (req, res) =>
{
    let g = req.params;
    let gender = g.gender == "m" ? "Male" : "Female";

    selectActors({ Gender: gender }).then(result =>
    {
        result.sort(function (a, b)
        {
           return a.FirstName.localeCompare(b.FirstName);
        });

        res.send(result);
    })
});


//App route to serve Details page
app.get("/MovieDetails", (req, res) =>
{
    res.sendFile(path.join(__dirname + "/Details.html"));
});

//Handles GET requests for movies. Returns an array of all movies sorted alphabetically by name
app.get("/MovieDetails/movies", (req, res) =>
{
    selectMovies({}).then(result =>
    {
        result.sort(function (a, b)
        {
            return a.MovieName.localeCompare(b.MovieName);
        });
        res.send(result);
    })
});

//Handles POST requests to create a new movie
app.post("/MovieDetails", (req, res) =>
{
    //Gets values from request content
    let movieName = req.body.movieName;
    let leadActor = req.body.leadActor;
    let leadActress = req.body.leadActress;

    //Checking if movie already exists by name. Movies in this universe only ever have one leading actor and one leading actress
    selectMovies({ MovieName: movieName }).then(result =>
    {
        //If the movie already exists, update the movie instead of making a new one
        if (result.length > 0)
        {
            updateMovie({ MovieName: movieName }, { MovieName: movieName, LeadActor: leadActor, LeadActress: leadActress }).then(result =>
            {
                res.send(result);
            });
        }
        else
        {
            //If the movie wasn't found, create a new movie record
            createMovie({ MovieName: movieName, LeadActor: leadActor, LeadActress: leadActress, Rating: 0.00, RatingCount: 0 }).then(result =>
            {
                res.send(result);
            });
        }
    });

});

//Handles POST requests for a new movie rating
app.post("/MovieRatings/Movie", (req, res) =>
{
    //Gets variables from request content
    var movieName = req.body.movieName;
    let rating = req.body.rating;
    let count = req.body.ratingCount;

    //Updates the movie with a new Rating value anda total number of ratings
    updateMovie({ MovieName: movieName }, { Rating: rating, RatingCount: count }).then(result =>
    {
        //Returns the updated movie object
        res.send({ MovieName: movieName, Rating: rating, RatingCount: count });
    });
});

//App route to serve the Ratings page
app.get("/MovieRatings", (req, res) =>
{
    res.sendFile(path.join(__dirname + "/Ratings.html"));
});

//Handles GET request for a specific movie by movie name
app.get("/MovieRatings/Movie/:MovieName", (req, res) =>
{
    //Get movie name from request content
    let movieName = req.params.MovieName;

    //Query DB for the movie, returns the result
    selectMovies({ MovieName: movieName }).then(result =>
    {
        res.send(result);
    })
})

//App route to the Relations page
app.get("/ActorRelations", (req, res) =>
{
    res.sendFile(path.join(__dirname + "/Relations.html"));
});

//Handles POST requests for relations to a given actor/actress
app.post("/ActorRelations", (req, res) =>
{
    //Gets first and last anem from request content
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;

    //Querying the actor record from DB for purposes of getting the Gender
    selectActors({ FirstName: firstName, LastName: lastName }).then(function (actor)
    {
        //Concatenates actor name
        let name = actor[0].FirstName + " " + actor[0].LastName;

        //If actor is Male, searches for all movies they've been in and adds the Lead Actresses to an array
        if (actor[0].Gender == "Male")
        {
            selectMovies({ LeadActor: name }).then(function (movies)
            {
                let actresses = [];
                movies.forEach(function (movie)
                {
                    let tempActress =
                    {
                        "Name": movie.LeadActress,
                        "Gender": "Female"
                    }

                    //Checks if actress is already in the array, if they are not, adds them
                    if (!actresses.some((item) =>  item.Name == tempActress.Name))
                    {
                        actresses.push(tempActress);
                    }
                });

                //Sorts actresses by name
                actresses.sort(function (a, b)
                {
                    return a.Name.localeCompare(b.Name);
                });
                res.send(actresses);
            });
        }
        else
        {
            //Queries mvoies for all movies the actress is in
            selectMovies({ LeadActress: name }).then(function (movies)
            {
                let actors = [];
                let actor = {};
                //Process the movies, and add the Lead Actors to an array
                movies.forEach(function (movie)
                {
                    let tempActor =
                    {
                        "Name": movie.LeadActor,
                        "Gender": "Male"
                    }
                    //If lead actor is not in the array, add them
                    if (!actors.some((item) => item.Name == tempActor.Name))
                    {
                        actors.push(tempActor);
                    }
                });
                //Sort actors  by name
                actors.sort(function (a, b)
                {
                    return a.Name.localeCompare(b.Name);
                });
                res.send(actors);
            });
        }
    });
});

app.listen(PORT, () => console.log("Listening on Port " + PORT));