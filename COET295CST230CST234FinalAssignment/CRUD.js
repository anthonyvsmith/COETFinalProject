"use strict";

const MongoClient = require("mongodb").MongoClient;

const uri = "mongodb+srv://kyw113:iewelyk212@clustercst234-hkwiq.azure.mongodb.net/<dbname>?retryWrites=true&w=majority";

var sCluster = "";
var sCollection = "";

module.exports =
{
    estCon: (cluster, collection) =>
    {
        sCluster = cluster;
        sCollection = collection;
    },
    createActor: insActorQuery =>
    {

    },
    createMovie: insMovieQuery =>
    {

    },
    createRating: insRatingQuery =>
    {
        
    },
    createRelation: insRelationQuery =>
    {

    },
    selectActors: selActorQuery =>
    {

    },
    selectMovies: selMovieQuery =>
    {

    },
    selectRating: selRatingQuery =>
    {

    },
    selectRelations: selRelationQuery =>
    {

    }

}