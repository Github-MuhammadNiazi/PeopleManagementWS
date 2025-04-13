const messages = require('../utils/messages');
const generateResponseBody = require('../utils/responseGenerator');
const winston = require('../utils/winston');
const constants = require('../utils/constants');

const allowAccess = (requiredRole) => {
    return (req, res, next) => {
        if (req.authorizedUser.userRoleId === constants.userRoles.Admin || requiredRole.includes(req.authorizedUser.userRoleId)) {
            next();
        } else {
            winston.info(`Unauthorized access blocked`, { req });
            return res.status(403).send(generateResponseBody({}, messages.systemMessages.unauthorizedOperation));
        }
    };
};

module.exports = allowAccess;
