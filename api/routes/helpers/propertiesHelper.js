const dbController = require('../../db/dbController');
const messages = require('../../utils/messages');
const generateResponseBody = require('../../utils/responseGenerator');
const winston = require('../../utils/winston');

const getUserRoles = async (req, res, next) => {
    try {
        winston.info(`Fetching all user roles.`, { req });
        const response = await dbController.GetUserRoles();
        winston.info(`${messages.properties.userRoles.allUserRolesRetrieved}`, { req });
        return res.send(generateResponseBody(response, messages.properties.userRoles.allUserRolesRetrieved))
    } catch (error) {
        winston.error(`${messages.properties.userRoles.failedToRetrieveAllUserRoles} Error: ${error.message}`, { req });
        return res.status(error.code || 500).send(generateResponseBody({}, messages.properties.userRoles.failedToRetrieveAllUserRoles, error.message));
    }
};

module.exports = {
    getUserRoles,
};
