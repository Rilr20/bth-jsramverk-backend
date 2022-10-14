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
            // console.log("här är jag");
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

function isEmailInArray(email, array) {
    let duplicate = false;

    array.access.forEach(element => {
        //email already exists
        if (element.user == email) {
            duplicate = true;
        }
    });
    return duplicate;
}

router.put("/invite", async (req, res) => {
    console.log(req.body);
    const ObjectId = require('mongodb').ObjectId;
    const documentId = req.body.documentId;
    const user = req.body.email;
    const permission = req.body.permission;
    const db = await database.getDb("docs");

    console.log(documentId);
    console.log(user);
    console.log(permission);

    //update document with id
    // const db = await database.getDb("docs");
    let filter = { _id: ObjectId(documentId) };

    let resultSet = await db.collection.findOne(filter, {});

    if (resultSet === null) {
        res.status(400).json({
            data: {
                status: 400,
                msg: `Document doesn't exist`
            }
        });
    } else {
        let emailInArray = isEmailInArray(user, resultSet);

        console.log(emailInArray);
        if (!emailInArray) {
            let accesArray = resultSet.access;

            //Checka att användaren inte redan finns där
            accesArray.push({ user: user, write: permission });
            // Ändra i dokumentets access arraay
            let err = await addDocToUser(documentId, permission, user);

            if (err === "err") {
                res.status(400).json({
                    data: {
                        msg: "400: user doesn't exist"
                    }
                });
            } else {
                resultSet = await db.collection.updateOne(filter, { $set: { access: accesArray } });

                console.log(resultSet);
                //  add document to the user
                console.log(err);
                if (resultSet.acknowledged) {
                    res.status(204).json({
                        data: {
                            status: 204,
                            msg: `document was updated`
                        }
                    });
                } else {
                    res.status(400).json({
                        data: {
                            status: 400,
                            msg: `Something went wrong`
                        }
                    });
                }
            }
        } else {
            res.status(400).json({
                data: {
                    status: 400,
                    msg: `User already has access`
                }
            });
        }
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
