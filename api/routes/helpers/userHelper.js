const dbController = require('../../db/dbController');
const messages = require('../../utils/messages');
const generateResponseBody = require('../../utils/responseGenerator');
const winston = require('../../utils/winston');
const constants = require('../../utils/constants');
const { getErrorCode, getPostgresErrorCodeMessage } = require('../../utils/converters');

/**
 * Function to get all users
 * @param {*} req
 * @param {*} res
 * @returns []
 */
const GetAllUsers = async (req, res) => {
    try {
        winston.info(`Fetching all users.`, { req });
        const response = await dbController.GetAllUsers();
        winston.info(`${messages.users.usersRetrievedSuccessfully}, Number of Users: ${response.length}`, { req });
        return res.send(generateResponseBody(response, messages.users.usersRetrievedSuccessfully))
    } catch (error) {
        winston.error(`${messages.users.failedToRetrieveAllUsers} Error: ${error.message}`, { req });
        winston.debug(`Error Stack: ${error.stack}`, { req });
        return res.status(getErrorCode(error, req)).send(generateResponseBody([], messages.users.failedToRetrieveAllUsers, getPostgresErrorCodeMessage(error, req)));
    }
};

/**
 * Function to get all users pending approval
 * @param {*} req
 * @param {*} res
 * @returns {}
 */
const GetUsersPendingApproval = async (req, res) => {
    try {
        winston.info(`Fetching all users pending approval.`, { req });
        const response = await dbController.GetUsersPendingApproval();
        winston.info(`${messages.users.usersRetrievedSuccessfully}, Number of Users: ${response.length}`, { req });
        return res.send(generateResponseBody(
            response,
            response.length
                ? messages.users.usersRetrievedSuccessfully
                : messages.users.noUserFoundPendingApproval
        ));
    } catch (error) {
        winston.error(`${messages.users.failedToRetrieveAllUsers} Error: ${error.message}`, { req });
        winston.debug(`Error Stack: ${error.stack}`, { req });
        return res.status(getErrorCode(error, req)).send(generateResponseBody([], messages.users.failedToRetrieveAllUsers, getPostgresErrorCodeMessage(error, req)));
    }
}

/**
 * Function to approve user
 * @param {*} req
 * @param {*} res
 * @returns {}
 */
const ApproveUser = async (req, res) => {
    try {
        const systemUser = await dbController.GetSystemUserByUserId(req.body.userId);
        if (systemUser.isApproved) {
            winston.info(`User with ID ${req.body.userId} is already approved.`, { req });
            return res.status(400).send(generateResponseBody({}, messages.users.userAlreadyApproved));
        }
        winston.info(`Approving user with ID ${req.body.userId}.`, { req });
        const response = await dbController.ApproveUser(
            req.body.userId,
            systemUser.employeeRoleId
                ? constants.userRoles.OperatingUser
                : constants.userRoles.ResidentUser,
            req.authorizedUser.userId);
        if (response) {
            winston.info(`User with ID ${req.body.userId} approved successfully.`, { req });
            return res.send(generateResponseBody({}, messages.users.userApprovedSuccessfully))
        } else {
            winston.info(`Failed to approve user with ID ${req.body.userId}.`, { req });
            return res.status(400).send(generateResponseBody({}, messages.users.failedToApproveUser));
        }
    } catch (error) {
        winston.debug(`Error Stack: ${error.stack}`, { req });
        return res.status(getErrorCode(error, req)).send(generateResponseBody({}, messages.users.failedToApproveUser, getPostgresErrorCodeMessage(error, req)));
    }
}

/**
 * Function to get all suspended users
 * @param {*} req
 * @param {*} res
 * @returns []
 */
const GetSuspendedUsers = async (req, res) => {
    try {
        winston.info(`Fetching all suspended users.`, { req });
        const response = await dbController.GetSuspendedUsers();
        winston.info(`${messages.users.usersRetrievedSuccessfully}, Number of Users: ${response.length}`, { req });
        return res.send(generateResponseBody(
            response,
            response.length
                ? messages.users.usersRetrievedSuccessfully
                : messages.users.noUserFoundWithSuspension
        ));
    } catch (error) {
        winston.error(`${messages.users.failedToRetrieveAllUsers} Error: ${error.message}`, { req });
        winston.debug(`Error Stack: ${error.stack}`, { req });
        return res.status(getErrorCode(error, req)).send(generateResponseBody([], messages.users.failedToRetrieveAllUsers, getPostgresErrorCodeMessage(error, req)));
    }
}

/**
 * Function to suspend user
 * @param {*} req
 * @param {*} res
 * @returns {}
 */
const SuspendUser = async (req, res) => {
    try {
        const systemUser = await dbController.GetSystemUserByUserId(req.body.userId);
        if (systemUser.isSuspended) {
            return res.status(400).send(generateResponseBody({}, messages.users.userAlreadySuspended));
        }
        const response = await dbController.SuspendUser(req);
        if (response) {
            return res.send(generateResponseBody({}, messages.users.userSuspendedSuccessfully))
        } else {
            return res.status(400).send(generateResponseBody({}, messages.users.failedToSuspendUser));
        }
    } catch (error) {
        winston.debug(`Error Stack: ${error.stack}`, { req });
        return res.status(getErrorCode(error, req)).send(generateResponseBody({}, messages.users.failedToSuspendUser, getPostgresErrorCodeMessage(error, req)));
    }
}

/**
 * Function to get all deleted users
 * @param {*} req
 * @param {*} res
 * @returns []
 */
const GetDeletedUsers = async (req, res) => {
    try {
        winston.info(`Fetching all deleted users.`, { req });
        const response = await dbController.GetDeletedUsers();
        winston.info(`${messages.users.usersRetrievedSuccessfully}, Number of Users: ${response.length}`, { req });
        return res.send(generateResponseBody(
            response,
            response.length
                ? messages.users.usersRetrievedSuccessfully
                : messages.users.noUserFoundWithDeletion
        ));
    } catch (error) {
        winston.error(`${messages.users.failedToRetrieveAllUsers} Error: ${error.message}`, { req });
        winston.debug(`Error Stack: ${error.stack}`, { req });
        return res.status(getErrorCode(error, req)).send(generateResponseBody([], messages.users.failedToRetrieveAllUsers, getPostgresErrorCodeMessage(error, req)));
    }
}

/**
 * Function to delete user
 * @param {*} req
 * @param {*} res
 * @returns {}
 */
const DeleteUser = async (req, res) => {
    try {
        const systemUser = await dbController.GetSystemUserByUserId(req.body.userId);
        if (systemUser.isDeleted) {
            return res.status(400).send(generateResponseBody({}, messages.users.userAlreadyDeleted));
        }
        const response = await dbController.DeleteUser(req);
        if (response) {
            return res.send(generateResponseBody({}, messages.users.userDeletedSuccessfully))
        } else {
            return res.status(400).send(generateResponseBody({}, messages.users.failedToDeleteUser));
        }
    } catch (error) {
        winston.debug(`Error Stack: ${error.stack}`, { req });
        return res.status(getErrorCode(error, req)).send(generateResponseBody({}, messages.users.failedToDeleteUser, getPostgresErrorCodeMessage(error, req)));
    }
}

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
        return res.status(getErrorCode(error, req)).send(generateResponseBody({}, messages.users.failedToCreateUser));

    } catch (error) {
        transactionStatus && await dbController.Rollback();
        return res.status(getErrorCode(error, req)).send(generateResponseBody({}, messages.employee.failedToCreateEmployee, getPostgresErrorCodeMessage(error, req)));
    }
}

module.exports = {
    GetAllUsers,
    GetUsersPendingApproval,
    ApproveUser,
    GetSuspendedUsers,
    SuspendUser,
    GetDeletedUsers,
    DeleteUser,
    CreateEmployee,
};
