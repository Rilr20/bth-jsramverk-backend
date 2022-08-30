const express = require("express");
const morgan = require('morgan')
const cors = require('cors')
const app = express();
const port = 1337;

app.use(cors())
if(process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'))
}

app.get("/", (req,res) => {
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

app.use((req,res,next) => {
    console.log(req.method);
    console.log(req.path)
    next()
})
app.use((req,res,next) => {
    var err = new Error("Not Found")
    err.status = 404
    next(err)
})

app.listen(port, () => console.log(`Example API listening on port ${port}!`));