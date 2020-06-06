'use strict';

var CRUD = require("./CRUD.js");
var express = require('express');
var fs = require('fs');
var path = require('path');
var app = express();

var PORT = 3000;

const estCon = CRUD.estCon;
const addActor = CRUD.createActor;

estCon("clusterCST234", "Movies");

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

//Route for gettings actors from MongoDB collection
app.get("/Actors/getActors", (req, res) =>
{

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

//App/Page route to the Relations page
app.get("/ActorRelations", (req, res) =>
{
    res.sendFile(path.join(__dirname + "/Relations.html"));
});

app.listen(PORT, () => console.log("Listening on Port " + PORT));