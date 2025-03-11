const messages = require('../utils/messages');
const generateResponseBody = require('../utils/responseGenerator');

const allowAccess = (requiredRole) => {
    return (req, res, next) => {
        if (requiredRole.includes(req.authorizedUser.role)) {
            next();
        } else {
            return res.status(403).send(generateResponseBody({}, messages.systemMessages.unauthorizedOperation));
        }
    };
};

module.exports = allowAccess;
