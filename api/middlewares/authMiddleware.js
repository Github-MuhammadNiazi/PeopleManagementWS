const jwt = require('jsonwebtoken');
const messages = require('../utils/messages');
const generateResponseBody = require('../utils/responseGenerator');

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send(generateResponseBody({}, messages.auth.noTokenProvided));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send(generateResponseBody({}, messages.auth.failedToAuthenticateToken));
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
