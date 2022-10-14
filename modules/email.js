const sgMail = require('@sendgrid/mail');
const template = require('./template');

sgMail.setApiKey(process.env.SENDGRID_KEY);

const emails = {

    sendEmail: async function (receiver, documentTitle, documentId, sender) {
        const from = "rilr20@student.bth.se";

        const message = template.returnHtml(receiver, from, documentTitle, documentId, sender);

        console.log(message);
        return await sgMail.send(message)
            .then(response => {
                return response;
            })
            .catch(error => console.log(error.message));
    }
};

module.exports = emails;
