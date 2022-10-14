const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const auth = {
    checkToken: function (req, res, next) {
        const token = req.headers['x-access-token'];
        let secret = process.env.JWT_SECRET;

        if (process.env.NODE_ENV === 'test') {
            secret = "8927345684584568456868468456845680670645685980257890125789126124";
        }

        // console.log(process.env.JWT_SECRET);
        jwt.verify(token, secret, function (err) {
            if (err) {
                return res.status(401).json({
                    errors: {
                        status: 401,
                        message: "Token is not valid.",
                        err: err
                    }
                });
            }

            // Valid token send on the request
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
                const secret = process.env.JWT_SECRET;

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
                errors: {
                    status: 401,
                    msg: "password is inccorrect"
                }
            });
        });
    }
};


module.exports = auth;
