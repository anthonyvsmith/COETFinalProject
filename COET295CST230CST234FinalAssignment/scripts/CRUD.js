"use strict";
/*
 * Anthony Smith    CST230
 * Kyle Wei         CST234
 * CRUD.js
 * Provides CRUD functions for collections in DB
 */

const MongoClient = require("mongodb").MongoClient;

//URI to MongoDB cluster
const uri = "mongodb+srv://kyw113:iewelyk212@clustercst234-hkwiq.azure.mongodb.net/<dbname>?retryWrites=true&w=majority";

var sCluster = "";

module.exports =
{
    //Establishing connection to a given cluster
    estCon: (cluster) =>
    {
        sCluster = cluster;
    },
    //Query for inserting an Actor into Actors collection
    createActor: insActorQuery =>
    {
        let sCollection = "Actors";
        return new Promise((resolve) =>
        {

            const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
            client.connect(err =>
            {
                if (err) throw err;

                const collection = client.db(sCluster).collection(sCollection);
                collection.insertOne(insActorQuery).then(documents =>
                {
                    resolve("Successfully added actor: " + documents.ops[0].FirstName + " " + documents.ops[0].LastName);
                    client.close();
                }).catch(err => console.log(err));
            })
        })
    },
    //Query for inserting movie into Movies collection
    createMovie: insMovieQuery =>
    {
        let sCollection = "Movies";
        return new Promise((resolve) =>
        {

            const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
            client.connect(err =>
            {
                if (err) throw err;

                const collection = client.db(sCluster).collection(sCollection);
                collection.insertOne(insMovieQuery).then(documents =>
                {

                    resolve("Successfully created " + documents.ops[0].MovieName);
                    client.close();
                }).catch(err => console.log(err));
            })
        })
    },
    //Query for selecting given actors from Actors collection
    selectActors: selActorQuery =>
    {
        return new Promise((resolve) =>
        {
            let sCollection = "Actors";

            const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
            client.connect(err =>
            {
                if (err) throw err;

                const collection = client.db(sCluster).collection(sCollection);
                collection.find(selActorQuery).toArray().then(documents =>
                {
                    resolve(documents);
                    client.close();
                }).catch(err => console.log(err));
            })
        })
    },
    //Query for selecting given movies from Movies collection
    selectMovies: selMovieQuery =>
    {
        return new Promise((resolve) =>
        {
            let sCollection = "Movies";

            const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
            client.connect(err =>
            {
                if (err) throw err;

                const collection = client.db(sCluster).collection(sCollection);
                collection.find(selMovieQuery).toArray().then(documents =>
                {
                    resolve(documents);
                    client.close();
                }).catch(err => console.log(err));
            })
        })
    },
    //Query for updating given movies in Movies collection
    updateMovie: (sSelection, sUpdate) =>
    {
        let sCollection = "Movies";

        return new Promise((resolve) =>
        {

            const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
            client.connect(err =>
            {
                if (err) throw err;

                const collection = client.db(sCluster).collection(sCollection);

                let updateStatement = { $set: sUpdate };

                collection.updateOne(sSelection, updateStatement).then(result =>
                {
                    resolve("Successfully updated " + sUpdate.MovieName);
                    client.close();
                }).catch(err => console.log(err));
            })

        })
    }
}