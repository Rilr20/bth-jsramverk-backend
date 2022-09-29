const database = require("../db/database");

const ObjectId = require('mongodb').ObjectId;
const collectionName = "docs";
const documents = {

    updateDocument: async function updateWine(id, text) {
        let db;

        try {
            db = await database.getDb(collectionName);

            const filter = { _id: ObjectId(id) };

            const options = { upsert: false };

            const updateDoc = {
                $set: {
                    text: text
                },
            };

            await db.collection.updateOne(filter, updateDoc, options);
        } catch (e) {
            console.error(e.msg);
        } finally {
            await db.client.close();
        }
    },

};

module.exports = documents;
