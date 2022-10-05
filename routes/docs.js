const express = require('express');
const router = express.Router();
const database = require("../db/database");
const auth = require('../modules/auth');

router.get(
    "/",
    (req, res, next) => auth.checkToken(req, res, next),
    async (req, res) => {
        console.log("getting docs");
        const db = await database.getDb("docs");
        const resultSet = await db.collection.find({}, {}).toArray();

        res.status(200).json({ data: resultSet });
    }
);

async function addDocToUser(docId, permission, email) {
    let filter = { email: email };
    const db = await database.getDb("users");
    let resultSet = await db.collection.findOne(filter, {});

    if (resultSet === null) {
        return "err";
    } else {
        let docs = resultSet.docs;

        // console.log(resultSet);
        if (resultSet !== 0) {
            console.log("här är jag");
            if (docs === undefined) {
                docs = [];
                docs[0] = {
                    docId: docId,
                    write: permission
                };
            } else {
                docs.push({ docId: docId, write: permission });
            }
            await db.collection.updateOne(filter, { $set: { docs: docs } });
        }
    }
}

router.post("/", async (req, res) => {
    //CREATE document to database
    // console.log(req.body);
    const title = req.body.title;
    const text = req.body.text;
    const email = req.body.email.toLowerCase();
    const code = req.body.code;
    const write = req.body.write;
    const db = await database.getDb("docs");
    const resultSet = await db.collection.insertOne({
        title: title,
        text: text,
        email: email,
        code: code,
        access: [{ user: email, write: write }]
    });

    let err = await addDocToUser(resultSet.insertedId, write, email);

    await db.client.close();
    if (err === "err") {
        res.status(400).json({
            data: {
                msg: "400: user doesn't exist"
            }
        });
    } else if (resultSet.acknowledged) {
        res.status(201).json({
            data: {
                msg: "201; Added an object!",
                insertedId: resultSet.insertedId

            }
        });
    } else {
        res.status(400).json({
            data: {
                msg: "400: something went wrong"
            }
        });
    }
});

router.put("/:id", async (req, res) => {
    // UPDATE document in database
    const title = req.body.title;
    const text = req.body.text;
    const id = req.params.id;
    const ObjectId = require('mongodb').ObjectId;
    let filter = { _id: ObjectId(id) };

    const db = await database.getDb("docs");
    let resultSet = await db.collection.updateOne(filter, { $set: { title: title, text: text } });

    await db.client.close();
    if (resultSet.acknowledged) {
        res.status(204).json({
            data: {
                msg: "Got a PUT request, sending back 204 Document Updated",
            }
        });
    } else {
        res.status(400).json({
            data: {
                msg: "400: something went wrong"
            }
        });
    }
});

router.delete("/", async (req, res) => {
    // DELETE document in database
    const id = req.body.id;
    const db = await database.getDb("docs");
    const ObjectId = require('mongodb').ObjectId;
    let filter = { _id: ObjectId(id) };

    const resultSet = await db.collection.deleteOne(filter);

    if (resultSet.acknowledged) {
        res.status(200).json({
            data: {
                msg: `item with id ${id} is deleted`
            }
        });
    } else {
        res.status(400).json({
            data: {
                msg: "400 something went wrong"
            }
        });
    }
});

module.exports = router;
