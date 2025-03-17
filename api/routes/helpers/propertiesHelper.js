const dbController = require('../../db/dbController');
const messages = require('../../utils/messages');
const generateResponseBody = require('../../utils/responseGenerator');
const winston = require('../../utils/winston');

/**
 * Fetches all user roles.
 * @param {*} req 
 * @param {*} res 
 * @returns []
 */
const getUserRoles = async (req, res) => {
    try {
        winston.info(`Fetching all user roles.`, { req });
        const response = await dbController.GetUserRoles();
        winston.info(`${messages.properties.userRoles.allUserRolesRetrieved}`, { req });
        return res.send(generateResponseBody(
            response,
            response.length
            ? messages.properties.userRoles.allUserRolesRetrieved
            : messages.properties.userRoles.noUserRoles
        ))
    } catch (error) {
        winston.error(`${messages.properties.userRoles.failedToRetrieveAllUserRoles} Error: ${error.message}`, { req });
        return res.status(error.code || 500).send(generateResponseBody([], messages.properties.userRoles.failedToRetrieveAllUserRoles, error.message));
    }
};

/**
 * Fetches all departments.
 * @param {*} req
 * @param {*} res
 * @returns []
 */
const getDepartments = async (req, res) => {
    try {
        winston.info(`Fetching all departments.`, { req });
        const response = await dbController.GetDepartments();
        winston.info(`${messages.properties.departments.allDepartmentsRetrieved}`, { req });
        return res.send(generateResponseBody(
            response,
            response.length
            ? messages.properties.departments.allDepartmentsRetrieved
            : messages.properties.departments.noDepartments
        ))
    } catch (error) {
        winston.error(`${messages.properties.departments.failedToRetrieveAllDepartments} Error: ${error.message}`, { req });
        return res.status(error.code || 500).send(generateResponseBody([], messages.properties.departments.failedToRetrieveAllDepartments, error.message));
    }
};

module.exports = {
    getUserRoles,
    getDepartments,
};
