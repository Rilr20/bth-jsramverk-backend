const express = require('express');
const router = express.Router();
const database = require("../db/database");

router.get("/", async (req, res) => {
    const db = await database.getDb();
    const resultSet = await db.collection.find({}, {}).toArray();

    res.status(200).json({ data: resultSet });
});

router.post("/", async (req, res) => {
    //CREATE document to database
    const title = req.body.title;
    const text = req.body.text;

    const db = await database.getDb();
    const resultSet = await db.collection.insertOne({ title: title, text: text });

    await db.client.close();
    if (resultSet.acknowledged) {
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

    const db = await database.getDb();
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
    const db = await database.getDb();
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