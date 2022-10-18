const database = require("../db/database");

const ObjectId = require('mongodb').ObjectId;
const collectionName = "comment";
const comment = {

    commentsByDocId: async function (documentId) {
        let db = await database.getDb(collectionName);
        let filter = { documentId: documentId };

        const resultSet = await db.collection.find(filter, {}).toArray();

        console.log(resultSet);
        return resultSet;
    },
    commentCreate: async function (documentId, email, text, startpos, endpos) {
        let db = await database.getDb(collectionName);

        console.log(Date.now());
        const resultSet = await db.collection.insertOne({
            documentId: documentId,
            email: email,
            text: text,
            date: Date.now().toString(),
            startpos: startpos,
            endpos: endpos
        });

        return resultSet;
    },
    commentDelete: async function (commentId) {
        let db = await database.getDb(collectionName);
        let filter = { _id: ObjectId(commentId) };

        const resultSet = await db.collection.deleteOne(filter);

        console.log(resultSet);
        return resultSet;
    }
};

module.exports = comment;
