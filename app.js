"use strict";
require('dotenv').config();
const express = require("express");
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const httpServer = require("http").createServer(app);
const bodyParser = require("body-parser");
const port = process.env.PORT || 1337;
const docs = require('./routes/docs');
const user = require('./routes/user');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors());
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
}

app.use('/docs', docs);
app.use('/user', user);

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

const io = require("socket.io")(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

let throttleTimer;

io.sockets.on('connection', function (socket) {
    socket.on('create', function (room) {
        socket.join(room);
    });

    socket.on("docsData", function (data) {//kan behövas ändras
        socket.to(data["_id"]).emit("docsData", data);

        clearTimeout(throttleTimer);
        console.log("writing");
        throttleTimer = setTimeout(function () {
            console.log("now it should save to database");
        }, 2000);
    });
});

const server = httpServer.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = server;
