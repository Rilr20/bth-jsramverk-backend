const mongo = require("mongodb").MongoClient;
// const collectionName = "docs";

const database = {
    getDb: async function getDb(collectionName, test=true) {
        let clstr = "cluster0.8ifmldd.mongodb.net/?retryWrites=true&w=majority";
        let mngdb = "mongodb+srv://";
        let dsn = `${mngdb}${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@${clstr}`;

        console.log(dsn);
        if (test) {
            console.log("test server");
            console.log("test server");
            console.log("test server");
            console.log("test server");
            dsn = "mongodb://127.0.0.1:27017";
        }

        const client = await mongo.connect(dsn, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const db = await client.db();
        const collection = await db.collection(collectionName);

        return {
            db: db,
            collection: collection,
            client: client,
        };
    }
};

module.exports = database;
