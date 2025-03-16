const dbController = require('../../db/dbController');
const messages = require('../../utils/messages');
const generateResponseBody = require('../../utils/responseGenerator');
const winston = require('../../utils/winston');

const getUserRoles = async (req, res, next) => {
    try {
        winston.info(`Fetching all user roles.`, { req });
        const response = await dbController.GetUserRoles();
        winston.info(`${messages.properties.userRoles.allUserRolesRetrieved}`, { req });
        return res.send(generateResponseBody(response, messages.users.userRolesRetrievedSuccessfully))
    } catch (error) {
        winston.error(`${messages.users.failedToRetrieveUserRoles} Error: ${error.message}`, { req });
        return res.status(error.code || 500).send(generateResponseBody({}, messages.users.failedToRetrieveUserRoles, error.message));
    }
};

module.exports = {
    getUserRoles,
};
