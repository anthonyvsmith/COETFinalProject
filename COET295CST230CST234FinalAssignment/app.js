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

estCon("clusterCST234");
app.use(express.static('scripts'));


//App/Page route to the home page
app.get("/", (req, res) =>
{
    res.sendFile(path.join(__dirname + "/Home.html"));
});

//App/Page route to the Create Actors page
app.get("/Actors", (req, res) =>
{
    res.sendFile(path.join(__dirname + "/CreateActors.html"));
});

//POST route for inserting an actor into the database
app.post("/Actors/createActor", (req, res) =>
{
    //Creating temporary 
    let fname = req.body.first;
    let lname = req.body.last;
    let gender = req.body.gender;

    addActor({ FirstName: fname, LastName: lname, Gender: gender }).then(result => {
        console.log(result);
    });
});

//GET route for getting actors from the database
app.get("/Actors/getActors", (req, res) =>
{
    selectActors({}).then(result =>
    {
        res.send(result);
    })
});


//App/Page route to the Details page
app.get("/MovieDetails", (req, res) =>
{
    res.sendFile(path.join(__dirname + "/Details.html"));
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
    console.log(req);
})

//App/Page route to the Relations page
app.get("/ActorRelations", (req, res) =>
{
    res.sendFile(path.join(__dirname + "/Relations.html"));
});

app.listen(PORT, () => console.log("Listening on Port " + PORT));