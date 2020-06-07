'use strict';

var CRUD = require("./scripts/CRUD.js");
var express = require('express');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var PORT = 3000;

const estCon = CRUD.estCon;
const addActor = CRUD.createActor;
const selectActors = CRUD.selectActors;
const selectMovies = CRUD.selectMovies;
const createMovie = CRUD.createMovie;
const updateMovie = CRUD.updateMovie;


estCon("clusterCST234");
app.use(express.static('scripts'));

//App/Page route to the home page
app.get("/", (req, res) =>
{
    res.sendFile(path.join(__dirname + "/CreateActors.html"));
});

//App/Page route to the Create Actors page
app.get("/Actors", (req, res) =>
{
    res.sendFile(path.join(__dirname + "/CreateActors.html"));
});

app.get("/Actors/all", (req, res) =>
{
    selectActors({}).then(result =>
    {
        result.sort(function (a, b)
        {
            return a.FirstName.localeCompare(b.FirstName);
        });
        res.send(result);
    })
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

//GET route for getting actors from the database
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


//App/Page route to the Details page
app.get("/MovieDetails", (req, res) =>
{
    res.sendFile(path.join(__dirname + "/Details.html"));
});

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

app.post("/MovieDetails", (req, res) =>
{
    let movieName = req.body.movieName;
    let leadActor = req.body.leadActor;
    let leadActress = req.body.leadActress;

    selectMovies({ MovieName: movieName }).then(result =>
    {
        if (result.length > 0)
        {
            updateMovie({ MovieName: movieName }, { MovieName: movieName, LeadActor: leadActor, LeadActress: leadActress }).then(result =>
            {
                res.send(result);
            });
        }
        else
        {
            createMovie({ MovieName: movieName, LeadActor: leadActor, LeadActress: leadActress, Rating: 0.00, RatingCount: 0 }).then(result =>
            {
                res.send(result);
            });
        }
    });

});

//App/Page route to the Ratings page
app.get("/MovieRatings", (req, res) =>
{
    res.sendFile(path.join(__dirname + "/Ratings.html"));
});

app.get("/MovieRatings/Movies", (req, res) =>
{
    selectMovies({}).then(result =>
    {
        res.send(result);
    })

})

//App/Page route to the Relations page
app.get("/ActorRelations", (req, res) =>
{
    res.sendFile(path.join(__dirname + "/Relations.html"));
});

app.post("/ActorRelations", (req, res) =>
{
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    selectActors({ FirstName: firstName, LastName: lastName }).then(function (actor)
    {
        let name = actor[0].FirstName + " " + actor[0].LastName;
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

                    if (!actresses.some((item) =>  item.Name == tempActress.Name))
                    {
                        actresses.push(tempActress);
                    }
                });
                console.log(actresses);
                actresses.sort(function (a, b)
                {
                    return a.Name.localeCompare(b.Name);
                });
                res.send(actresses);
            });
        }
        else
        {
            selectMovies({ LeadActress: name }).then(function (movies)
            {
                let actors = [];
                let actor = {};
                movies.forEach(function (movie)
                {
                    let tempActor =
                    {
                        "Name": movie.LeadActor,
                        "Gender": "Male"
                    }
                    if (!actors.some((item) => item.Name == tempActor.Name))
                    {
                        actors.push(tempActor);
                    }
                });
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