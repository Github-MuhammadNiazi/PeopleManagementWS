const jwt = require('jsonwebtoken');
const messages = require('../utils/messages');
const generateResponseBody = require('../utils/responseGenerator');

const checkAccess = (requiredRole) => {
    return (req, res, next) => {
        let token = req.headers['authorization'];
        if (token && token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }
        if (!token) {
            return res.status(401).send(generateResponseBody({}, messages.auth.token.noTokenProvided));
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).send(generateResponseBody({}, messages.auth.token.failedToAuthenticateToken));
            }
            if (user.role <= requiredRole) {
                next();
            } else {
                return res.status(403).send(generateResponseBody({}, messages.systemMessages.unauthorizedOperation));
            }
        });
    };
};

module.exports = checkAccess;