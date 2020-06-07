"use strict";

const MongoClient = require("mongodb").MongoClient;

const uri = "mongodb+srv://kyw113:iewelyk212@clustercst234-hkwiq.azure.mongodb.net/<dbname>?retryWrites=true&w=majority";

var sCluster = "";

module.exports =
{
    estCon: (cluster) =>
    {
        sCluster = cluster;
    },
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
                    console.log(documents.ops[0].MovieName);
                    resolve("Successfully created movie: " + documents.ops[0].MovieName);
                    client.close();
                }).catch(err => console.log(err));
            })
        })
    },
    createRating: insRatingQuery =>
    {
        
    },
    createRelation: insRelationQuery =>
    {

    },
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
                    resolve(result);
                    client.close();
                }).catch(err => console.log(err));
            })

        })
    },
    selectRating: selRatingQuery =>
    {

    },
    selectRelations: selRelationQuery =>
    {

    }

}