const template = {
    to: "",
    from: "",
    documentTitle: "",
    documentId: "",
    link: "",
    sender: "",
    structure: "",
    setVariables: function (to, from, documentTitle, documentId, sender) {
        this.to = to;
        this.from = from;
        this.documentTitle = documentTitle;
        this.documentId = documentId;
        this.sender = sender;
    },
    initStructure: function () {
        this.structure = `<body style="background-color: aliceblue;">
        <div>
            <div>
                <h1 style="text-align: center;">${this.documentTitle}</h1>
            </div>
            <p>${this.sender} has invited you to ${this.documentTitle}</p>
            <a clicktracking="off" href="www.student.bth.se/~rilr20/editor/">Link to the website</a>
            <p>Use the code "${this.documentId}" on the invite page to join the document</p>
        </div>
    </body>`;
    },
    returnHtml: function (to, from, documentTitle, documentId, sender) {
        this.setVariables(to, from, documentTitle, documentId, sender);
        this.initStructure();
        // console.log(this.to);
        // console.log(this.from);
        // console.log(this.documentTitle);
        // console.log(this.documentId);
        console.log("this.structure");
        console.log(this.structure);
        console.log(this.documentTitle);
        console.log("this.structure");
        return {
            to: this.to,
            from: this.from,
            subject: "Document Invite to " + documentTitle,
            html: this.structure,
            trackingSettings: {
                clickTracking: {
                    enable: false,
                    enableText: false
                },
                openTracking: {
                    enable: false
                }
            }
        };
    }
};

module.exports = template;
