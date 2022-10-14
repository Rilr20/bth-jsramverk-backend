const express = require('express');
const router = express.Router();
const email = require('../modules/email');

router.post("/send", async (req, res) => {
    //CREATE document to database
    // console.log(req.body);
    const receiver = req.body.receiver;
    const documentId = req.body.documentId;
    const documentTitle = req.body.documentTitle;
    const sender = req.body.sender;
    let result = await email.sendEmail(receiver, documentTitle, documentId, sender);

    if (result === undefined) {
        res.status(400).json({
            data: {
                status: 400,
                msg: "Invalid email",
            }
        });
    } else {
        res.status(202).json({
            data: {
                msg: "202 email sent",
            }
        });
    }
});

module.exports = router;
