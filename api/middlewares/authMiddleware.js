const jwt = require('jsonwebtoken');
const messages = require('../utils/messages');
const generateResponseBody = require('../utils/responseGenerator');
const winston = require('../utils/winston');

const authenticateToken = (req, res, next) => {
    let token = req.headers['authorization'];
    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }
    if (!token) {
        return res.status(401).send(generateResponseBody({}, messages.auth.token.noTokenProvided));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err || !user?.userId) {
            winston.error('Token verification failed', { req });
            return res.status(403).send(generateResponseBody({}, messages.auth.token.failedToAuthenticateToken));
        }
        req.authorizedUser = user;
        winston.info(`Request Made by User with Id ${user.userId}`, { req });
        next();
    });
};

module.exports = authenticateToken;
