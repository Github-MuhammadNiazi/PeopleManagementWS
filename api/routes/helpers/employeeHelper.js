const dbController = require('../../db/dbController');
const messages = require('../../utils/messages');
const generateResponseBody = require('../../utils/responseGenerator');
const winston = require('../../utils/winston');
const constants = require('../../utils/constants');
const { getErrorCode, getPostgresErrorCodeMessage } = require('../../utils/converters');

/**
 * Function to get all employees
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @returns {} - The list of all employees
 */
const GetAllEmployees = async (req, res) => {
    try {
        winston.info(`Fetching all employees.`, { req });
        const response = await dbController.GetAllEmployees(req.pagination, req.query.isManager, req.query.departmentId || null);
        winston.info(`${messages.employee.allEmployeesRetrieved}, Number of Employees: ${response.length}`, { req });
        return res.send(generateResponseBody(response, response.length ? messages.employee.allEmployeesRetrieved : messages.employee.noEmployeesFound));
    } catch (error) {
        winston.error(`Error while fetching all employees: ${error.message}`, { req });
        winston.debug(`Error Stack: ${error.stack}`, { req });
        return res.status(getErrorCode(error, req)).send(generateResponseBody([], messages.employee.failedToRetrieveAllEmployees, getPostgresErrorCodeMessage(error, req)));
    }
};

/**
 * Function to create a new employee
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @returns {} - The newly created employee
 */
const CreateEmployee = async (req, res) => {
    let transactionStatus = false;
    try {

        // Confirming if userRole is valid
        const userRole = await dbController.GetUserRoleByRoleId(req.body.userRoleId);

        const EmployeeRole = await dbController.GetEmployeeRoleByRoleId(req.body.employeeRoleId);

        // Preventing any high level account creation
        if (!userRole || !EmployeeRole) {
            return res.status(400).send(generateResponseBody({}, messages.employee.invalidEmployeeRole));
        }

        // Starting transaction
        await dbController.Begin();
        transactionStatus = true;

        // Creating User record
        const createUserResponse = await dbController.CreateUser(req.body);

        if (createUserResponse) {

            const randomPassword = Math.random().toString(36).slice(-8);

            // Creating SystemUser record
            const systemUserResponse = await dbController.CreateSystemUser({
                userId: createUserResponse.UserId,
                userRoleId: req.body.userRoleId,
                username: req.body.identificationNumber,
                password: randomPassword,
                employeeRoleId: req.body.employeeRoleId,
            }, req?.authorizedUser?.userId || null);

            if (systemUserResponse) {

                // Committing transaction if all operations are successful
                await dbController.Commit();
                return res.status(201).send(generateResponseBody({ ...systemUserResponse, password: randomPassword }, messages.employee.employeeCreatedSuccessfully));
            }
        }
        return res.status(400).send(generateResponseBody({}, messages.users.failedToCreateUser));

    } catch (error) {
        transactionStatus && await dbController.Rollback();
        return res.status(getErrorCode(error, req)).send(generateResponseBody({}, messages.employee.failedToCreateEmployee, getPostgresErrorCodeMessage(error, req)));
    }
}

module.exports = {
    GetAllEmployees,
    CreateEmployee,
};
