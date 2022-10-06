const database = require("../db/database");

const ObjectId = require('mongodb').ObjectId;
const collectionName = "docs";
const documents = {

    updateDocument: async function (id, text) {
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
    getAllDocs: async function () {
        let db = await database.getDb(collectionName);

        const resultSet = await db.collection.find({}, {}).toArray();

        return resultSet;
    },
    getDocsByEmail: async function(email) {
        let db = await database.getDb(collectionName);

        const resultSet = await db.collection.find({}, {}).toArray();
        let res = [];

        resultSet.forEach(element => {
            for (let i = 0; i < element.access.length; i++) {
                if (element.access.length !== 0 && element.access[i].user === email) {
                    res.push(element);
                }
            }
        });
        return res;
    }
};

module.exports = documents;
