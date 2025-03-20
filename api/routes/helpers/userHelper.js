const dbController = require('../../db/dbController');
const messages = require('../../utils/messages');
const generateResponseBody = require('../../utils/responseGenerator');
const winston = require('../../utils/winston');

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
        return res.status(error.code || 500).send(generateResponseBody([], messages.users.failedToRetrieveAllUsers, error.message));
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
        return res.status(error.code || 500).send(generateResponseBody([], messages.users.failedToRetrieveAllUsers, error.message));
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
        const userStatus = await dbController.CheckUserStatuses(req.body.userId);
        if (userStatus.IsApproved) {
            return res.status(400).send(generateResponseBody({}, messages.users.userAlreadyApproved));
        }
        const response = await dbController.ApproveUser(req);
        if (response) {
            return res.send(generateResponseBody({}, messages.users.userApprovedSuccessfully))
        } else {
            return res.status(400).send(generateResponseBody({}, messages.users.failedToApproveUser));
        }
    } catch (error) {
        return res.status(error.code || 500).send(generateResponseBody({}, messages.users.failedToApproveUser, error.message));
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
        return res.status(error.code || 500).send(generateResponseBody([], messages.users.failedToRetrieveAllUsers, error.message));
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
        const userStatus = await dbController.CheckUserStatuses(req.body.userId);
        if (userStatus.IsSuspended) {
            return res.status(400).send(generateResponseBody({}, messages.users.userAlreadySuspended));
        }
        const response = await dbController.SuspendUser(req);
        if (response) {
            return res.send(generateResponseBody({}, messages.users.userSuspendedSuccessfully))
        } else {
            return res.status(400).send(generateResponseBody({}, messages.users.failedToSuspendUser));
        }
    } catch (error) {
        return res.status(error.code || 500).send(generateResponseBody({}, messages.users.failedToSuspendUser, error.message));
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
        return res.status(error.code || 500).send(generateResponseBody([], messages.users.failedToRetrieveAllUsers, error.message));
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
        const userStatus = await dbController.CheckUserStatuses(req.body.userId);
        if (userStatus.IsDeleted) {
            return res.status(400).send(generateResponseBody({}, messages.users.userAlreadyDeleted));
        }
        const response = await dbController.DeleteUser(req);
        if (response) {
            return res.send(generateResponseBody({}, messages.users.userDeletedSuccessfully))
        } else {
            return res.status(400).send(generateResponseBody({}, messages.users.failedToDeleteUser));
        }
    } catch (error) {
        return res.status(error.code || 500).send(generateResponseBody({}, messages.users.failedToDeleteUser, error.message));
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
};
