const express = require('express');
const router = express.Router();
const database = require("../db/database");

// const ObjectId = require('mongodb').ObjectId;
const bcrypt = require('bcryptjs');
const auth = require('../modules/auth');
const saltRounds = 10;

const collectionName = "users";

// Testing routes with method
// router.get("/", async (req, res) => {
//     res.json({
//         data: {
//             msg: ["Got a GET request, sending back default 200"]
//         }
//     });
// });

router.post("/login", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400).json({
            errors: {
                status: 400,
                msg: "Email/password is missing"
            }
        });
    }
    let db = await database.getDb(collectionName);

    try {
        const query = { email: email };
        const user = await db.collection.findOne(query);

        if (user) {
            return auth.comparePasswords(res, user, password);
        }
        return res.status(401).json({
            data: {
                status: 401,
                msg: "user does not exist"
            }
        });
    } catch (error) {
        return res.status(500).json({
            errors: {
                status: 500,
                msg: "Could not find user",
            }
        });
    } finally {
        await db.client.close();
    }
});

router.post("/register", async (req, res) => {
    //sent to database
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400).json({
            errors: {
                status: 400,
                msg: "Email/password is missing"
            }
        });
    }

    bcrypt.hash(password, saltRounds, async function (err, hash) {
        if (err) {
            return res.status(500).json({
                status: 500,
                msg: "error hashing"
            });
        }
        let db = await database.getDb(collectionName);
        let filter = { email: email };
        let resultSet = await db.collection.find(filter, {}).toArray();

        if (resultSet.length !== 0) {
            // console.log("user found");
            res.status(401).json({
                errors: {
                    status: 401,
                    msg: "Email already in use"
                }
            });
        } else {
            resultSet = await db.collection.insertOne({ email: email, password: hash });

            await db.client.close();

            console.log("resultSet");
            if (resultSet.acknowledged) {
                res.status(201).json({
                    data: {
                        msg: "201; user registerd",
                        insertedId: resultSet.insertedId
                    }
                });
            } else {
                res.status(400).json({
                    errors: {
                        status: 400,
                        msg: "something went wrong"
                    }
                });
            }
        }
    });
});

router.get("/:email", async (req, res) => {
    const email = req.params.email.toLowerCase();

    let filter = { email: email };

    const db = await database.getDb(collectionName);
    let resultSet = await db.collection.find(filter, {}).toArray();

    await db.client.close();
    if (resultSet.length === 0) {
        console.log("no user found");
        res.status(401).json({
            errors: {
                status: 401,
                msg: "no user found"
            }
        });
    } else {
        res.status(200).json({ data: resultSet });
    }
    // if (resultSet.acknowledged) {
    // }
});

// router.put("/", (req, res) => {
//     // PUT requests should return 204 No Content
//     res.status(204).send();
// });

// router.delete("/", (req, res) => {
//     // DELETE requests should return 204 No Content
//     res.status(204).send();
// });

module.exports = router;
