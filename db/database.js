const mongo = require("mongodb").MongoClient;
// const config = require("./config.json")
// require('dotenv').config()
const collectionName = "docs";


const database = {
    getDb: async function getDb() {
        let clstr = "cluster0.8ifmldd.mongodb.net /? retryWrites = true & w=majority";
        let mngdb = "mongodb+srv://";
        let dsn = `${mngdb}${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@${clstr}`;
        // console.log(dsn);

        if (process.env.NODE_ENV === 'test') {
            dsn = "mongodb://localhost:27017";
        }

        const client = await mongo.connect(dsn, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const db = await client.db();
        const collection = await db.collection(collectionName);

        return {
            collection: collection,
            client: client,
        };
    }
};

module.exports = database;
