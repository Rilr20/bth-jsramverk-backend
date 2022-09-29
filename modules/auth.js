const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const auth = {
    checkToken: function (req, res, next) {
        const token = req.headers['x-access-tokenn'];

        jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
            if (err) {
                return res.status(401).json({
                    errors: {
                        status: 401,
                        msg: "token is not valid"
                    }
                });
            }

            next();
        });
    },
    comparePasswords: function (res, user, password) {
        bcrypt.compare(password, user.password, function (err, result) {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        msg: "decryption error"
                    }
                });
            }

            if (result) {
                const payload = { email: user.email };
                const secret = process.env.JWT_TOKEN;

                const token = jwt.sign(payload, secret, { expiresIn: '1h' });

                return res.status(201).json({
                    data: {
                        _id: user["_id"],
                        email: user.email,
                        token: token,
                    }
                });
            }

            return res.status(401).json({
                errosr: {
                    status: 401,
                    msg: "password is inccorrect"
                }
            });
        });
    }
};


module.exports = auth;
