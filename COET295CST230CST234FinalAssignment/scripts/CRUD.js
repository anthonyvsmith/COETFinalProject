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
                    resolve("Insert was successful " + documents.insertedId);
                    client.close();
                }).catch(err => console.log(err));
            })
        })
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

    },
    selectRating: selRatingQuery =>
    {

    },
    selectRelations: selRelationQuery =>
    {

    }

}