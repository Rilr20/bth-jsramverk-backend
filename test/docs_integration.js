/* eslint-disable */
process.env.NODE_ENV = 'test';
require('dotenv').config();

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');

chai.should();

chai.use(chaiHttp);

const database = require("../db/database");
const collectionName = "docs";

describe('Docs paths', () => {
    before(() => {
        return new Promise(async (resolve) => {
            const db = await database.getDb();

            db.db.listCollections(
                { name: collectionName }
            ) 
                .next()
                .then(async function (info) {
                    if (info) {
                        await db.collection.drop();
                    }
                })
                .catch(function (err) {
                    console.error(err);
                })
                .finally(async function () {
                    await db.client.close();
                    resolve();
                });
        });
    });

    describe('GET /docs', () => {
        it('200 PATH', (done) => {
            chai.request(server)
                .get("/docs")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("array");
                    res.body.data == ""
                    res.body.data.length.should.be.equal(0);
                    done();
                });
        });
    })
    describe('POST /docs', () => {

        it('201 creating document', (done) => {
            let docs = {
                title: "title",
                text: "text"
            }
            chai.request(server)
            .post("/docs")
            .send(docs)
            .end((err,res)=> {
                res.should.have.status(201)
                res.body.should.be.an("object")
                res.body.should.have.property("data")
                res.body.data.should.have.property("msg")

                done();
            });
        })

        it('200 PATH', (done) => {
            chai.request(server)
                .get("/docs")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object")
                    res.body.data.should.be.an("array")
                    res.body.data.length.should.be.equal(1);
                    done();
                });
        });
    });
    // describe('PUT /docs', () => {
    //     it('200 PATH', (done) => {
    //         chai.request(server)
    //         .put("/docs")
    //         .end((err,res)=> {
    //             res.should.have.status(200)
    //         })
    //     })
    // });
    // describe('DELETE /docs', () => {
    //     it('200 PATH', (done) => {
    //         chai.request(server)
    //         .delete("/docs")
    //         .end((err,res)=> {
    //             res.should.have.status(200)
    //         })
    //     })
    // });


});
