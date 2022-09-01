const express = require("express");
const morgan = require('morgan')
const cors = require('cors');
const database = require("./db/database");
const { ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 1337

app.use(cors())
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'))
}

app.get("/", (req, res) => {
    const data = {
        data: {
            msg: "Hello World"
        }
    };
    res.json(data)
})

app.get("/me", (req, res) => {
    res.json({
        data: {
            description: "Hej! Jag heter Rikard"
        }
    });
});

app.get("/docs")

app.post("/docs", (req, res) => {
    //CREATE document to database

    let title = req.params.title
    let text = req.params.text
    const db = await database.getDb();
    const resultSet = await db.collection.insertOne({ title: title, text: text })
    await db.client.close()
    res.status(201).json({
        data: {
            msg: "Got a POST request, sending back 201 Document Created"
        }
    });
});

app.put("/docs", (req, res) => {
    // UPDATE document in database

    let title = req.params.title
    let text = req.params.text
    let id = req.params.id
    try {
        db = await database.getDb()
    } catch (error) {
        
    } finally {
        await db.client.close()
    }
    res.status(201).json({
        data: {
            msg: "Got a POST request, sending back 201 Document Created"
        }
    });
});

app.delete("/docs", (req, res) => {
    // DELETE document in database
    res.status(400).json({
        data: {
            msg: "nothing happened"
        }
    })
})



// Testing routes with method
app.get("/user", (req, res) => {
    res.json({
        data: {
            msg: "Got a GET request, sending back default 200"
        }
    });
});



app.post("/user", (req, res) => {
    res.status(201).json({
        data: {
            msg: "Got a POST request, sending back 201 Created"
        }
    });
});

app.put("/user", (req, res) => {
    // PUT requests should return 204 No Content
    res.status(204).send();
});

app.delete("/user", (req, res) => {
    // DELETE requests should return 204 No Content
    res.status(204).send();
});

app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.path)
    next()
})
app.use((req, res, next) => {
    var err = new Error("Not Found")
    err.status = 404
    next(err)
})

async function updateDocument(dsn, col, id, title, text) {
    const ObjectId = require('mongodb').ObjectId;
    const filter = { _id: ObjectId(body["_id"]) };

    const client = await mongo.connect(dsn);
    const db = await client.db();
    const col = await db.collection(colName);
    const res = await col.updateOne(filter, { title: title, text: text });
    await client.close();
    return res
}

async function getAll(dsn, colName) {
    const client = await mongo.connect(dsn);
    const db = await client.db();
    const col = await db.collection(colName);
    const res = await col.find().toArray();

    await client.close();

    return res;
}

async function findInCollection(dsn, colName, criteria, projection, limit) {
    const client = await mongo.connect(dsn);
    const db = await client.db();
    const col = await db.collection(colName);
    const res = await col.find(criteria, projection).limit(limit).toArray();

    await client.close();

    return res;
}

app.listen(port, () => console.log(`Example API listening on port ${port}!`));