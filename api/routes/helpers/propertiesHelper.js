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
        return res.status(error.status || error.code || 500).send(generateResponseBody([], messages.properties.userRoles.failedToRetrieveAllUserRoles, error.message));
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
        return res.status(error.status || error.code || 500).send(generateResponseBody([], messages.properties.departments.failedToRetrieveAllDepartments, error.message));
    }
};

/**
 * Creates a new department.
 * @param {*} req
 * @param {*} res
 * @returns {}
 */
const createDepartment = async (req, res) => {
    try {
        winston.info(`Validating if department already exists.`, { req });
        const department = await dbController.GetDepartmentByName(req.body.departmentName);
        if (department.length) {
            winston.error(`Department already exists.`, { req });
            return res.status(409).send(generateResponseBody([], messages.properties.departments.departmentAlreadyExists));
        }
        winston.info(`Department with name '${req.body.departmentName}' does not exist.`, { req });
        winston.info(`Creating a new department.`, { req });
        const response = await dbController.CreateDepartment(req);
        winston.info(`Department created successfully.`, { req });
        return res.send(generateResponseBody(response, messages.properties.departments.departmentCreatedSuccessfully));
    } catch (error) {
        winston.error(`Failed to create department. Error: ${error.message}`, { req });
        return res.status(error.status || error.code || 500).send(generateResponseBody([], messages.properties.departments.failedToCreateDepartment, error.message));
    }
};

/**
 * Fetches all employee roles.
 * @param {*} req
 * @param {*} res
 * @returns []
 */
const getEmployeeRoles = async (req, res) => {
    try {
        winston.info(`Fetching all employee roles.`, { req });
        const response = await dbController.GetEmployeeRoles();
        winston.info(`${messages.properties.employeeRoles.allEmployeeRolesRetrieved}`, { req });
        return res.send(generateResponseBody(
            response,
            response.length
            ? messages.properties.employeeRoles.allEmployeeRolesRetrieved
            : messages.properties.employeeRoles.noEmployeeRoles
        ))
    } catch (error) {
        winston.error(`${messages.properties.employeeRoles.failedToRetrieveAllEmployeeRoles} Error: ${error.message}`, { req });
        return res.status(error.status || error.code || 500).send(generateResponseBody([], messages.properties.employeeRoles.failedToRetrieveAllEmployeeRoles, error.message));
    }
}

const createEmployeeRole = async (req, res) => {
    try {
        winston.info(`Validating if employee role already exists.`, { req });
        const employeeRole = await dbController.GetEmployeeRoleByName(req.body.roleName);
        if (employeeRole.length) {
            winston.error(`Employee role already exists.`, { req });
            return res.status(409).send(generateResponseBody([], messages.properties.employeeRoles.employeeRoleAlreadyExists));
        }
        winston.info(`Employee role with name '${req.body.roleName}' does not exist.`, { req });
        winston.info(`Creating a new employee role.`, { req });
        const response = await dbController.CreateEmployeeRole(req);
        winston.info(`Employee role created successfully.`, { req });
        return res.send(generateResponseBody(response, messages.properties.employeeRoles.employeeRoleCreatedSuccessfully));
    } catch (error) {
        winston.error(`Failed to create employee role. Error: ${error.message}`, { req });
        return res.status(error.status || error.code || 500).send(generateResponseBody([], messages.properties.employeeRoles.failedToCreateEmployeeRole, error.message));
    }
}

module.exports = {
    getUserRoles,
    getDepartments,
    createDepartment,
    getEmployeeRoles,
    createEmployeeRole,
};
