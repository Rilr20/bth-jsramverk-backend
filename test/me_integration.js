/* eslint-disable */
process.env.NODE_ENV = "test";

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');

chai.should(),

    chai.use(chaiHttp);

describe('Me', () => {
    describe('GET /me', () => {
        it('200 PATH', (done) => {
            chai.request(server)
                .get("/me")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.msg === "Hej! Jag heter Rikard";
                    done();
                });
        })
    });
    describe('GET /', () => {
        it('200 PATH', (done) => {
            chai.request(server)
                .get("/")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.msg === "Hello World";
                    done();
                });
        })
    });
});
