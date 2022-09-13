"use strict";
require('dotenv').config();
const express = require("express");
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 1337;
const docs = require('./routes/docs');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors());
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
}

app.use('/docs', docs);

app.get("/", (req, res) => {
    const data = {
        data: {
            msg: "Hello World"
        }
    };

    res.json(data);
});

app.get("/me", (req, res) => {
    res.json({
        data: {
            msg: "Hej! Jag heter Rikard!"
        }
    });
});

// Testing routes with method
app.get("/user", (req, res) => {
    res.json({
        data: {
            msg: ["Got a GET request, sending back default 200"]
        }
    });
});

app.post("/user", (req, res) => {
    res.status(201).json({
        data: {
            users: []
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
    console.log(req.path);
    next();
});
app.use((req, res, next) => {
    var err = new Error("Not Found");

    err.status = 404;
    next(err);
});

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = server;
