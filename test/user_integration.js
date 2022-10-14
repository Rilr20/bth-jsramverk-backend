/* eslint-disable */
process.env.NODE_ENV = 'test';
require('dotenv').config();

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');

chai.should();

chai.use(chaiHttp);

const database = require("../db/database");
const collectionName = "users";

describe('User paths', () => {
    before(() => {
        return new Promise(async (resolve) => {
            const db = await database.getDb(collectionName);
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
    describe('POST /user', () => {
        it('201 register user', (done) => {
            let user = {
                email: "test@email.com",
                password: "password",
            }
            chai.request(server)
                .post("/user/register")
                .send(user)
                .end((err, res) => {
                    // console.log(err);
                    res.should.have.status(201)
                    res.body.should.be.an("object")
                    res.body.should.have.property("data")
                    res.body.data.should.have.property("msg")

                    done();
                });
        })

        it('200 PATH', (done) => {
            chai.request(server)
                .get("/user/test@email.com")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object")
                    res.body.data.should.be.an("array")
                    res.body.data.length.should.be.equal(1);

                    done();
                });
        });
    });
    describe('Login in a user', () => {
        it('201 register user', (done) => {
            let user = {
                email: "test2@email.com",
                password: "password",
            }
            chai.request(server)
                .post("/user/register")
                .send(user)
                .end((err, res) => {
                    // console.log(err);
                    res.should.have.status(201)
                    res.body.should.be.an("object")
                    res.body.should.have.property("data")
                    res.body.data.should.have.property("msg")

                    done();
                });
        })

        it('201 log in user', (done) => {
            let user = {
                email: "test2@email.com",
                password: "password",
            }
            chai.request(server)
                .post("/user/login")
                .send(user)
                .end((err, res) => {
                    // console.log(err);
                    res.should.have.status(201)
                    res.body.should.be.an("object")
                    res.body.should.have.property("data")
                    res.body.data.should.have.property("_id")
                    res.body.data.should.have.property("email")
                    res.body.data.should.have.property("token")

                    done();
                });
        })
    });

});
