const dbController = require('../../db/dbController');
const messages = require('../../utils/messages');
const generateResponseBody = require('../../utils/responseGenerator');
const winston = require('../../utils/winston');

const GetAllUsers = async (req, res) => {
    try {
        winston.info(`Fetching all users.`, { req });
        const response = await dbController.GetAllUsers();
        winston.info(`${messages.users.usersRetrievedSuccessfully}, Number of Users: ${response.length}`, { req });
        return res.send(generateResponseBody(response, messages.users.usersRetrievedSuccessfully))
    } catch (error) {
        winston.error(`${messages.users.failedToRetrieveAllUsers} Error: ${error.message}`, { req });
        return res.status(error.code || 500).send(generateResponseBody({}, messages.users.failedToRetrieveAllUsers, error.message));
    }
};

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
        return res.status(error.code || 500).send(generateResponseBody({}, messages.users.failedToRetrieveAllUsers, error.message));
    }
}

const ApproveUser = async (req, res) => {
    try {
        const userStatus = await dbController.CheckUserStatuses(req.body.userId);
        if (userStatus.isApproved) {
            return res.status(400).send(generateResponseBody({}, messages.users.userAlreadyApproved));
        }
        const response = await dbController.ApproveUser(req.body);
        if (response) {
            return res.send(generateResponseBody({}, messages.users.userApprovedSuccessfully))
        } else {
            return res.status(400).send(generateResponseBody({}, messages.users.failedToApproveUser));
        }
    } catch (error) {
        return res.status(error.code || 500).send(generateResponseBody({}, messages.users.failedToApproveUser, error.message));
    }
}

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
        return res.status(error.code || 500).send(generateResponseBody({}, messages.users.failedToRetrieveAllUsers, error.message));
    }
}

const SuspendUser = async (req, res) => {
    try {
        const userStatus = await dbController.CheckUserStatuses(req.body.userId);
        if (userStatus.isSuspended) {
            return res.status(400).send(generateResponseBody({}, messages.users.userAlreadySuspended));
        }
        const response = await dbController.SuspendUser(req.body);
        if (response) {
            return res.send(generateResponseBody({}, messages.users.userSuspendedSuccessfully))
        } else {
            return res.status(400).send(generateResponseBody({}, messages.users.failedToSuspendUser));
        }
    } catch (error) {
        return res.status(error.code || 500).send(generateResponseBody({}, messages.users.failedToSuspendUser, error.message));
    }
}

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
        return res.status(error.code || 500).send(generateResponseBody({}, messages.users.failedToRetrieveAllUsers, error.message));
    }
}

const DeleteUser = async (req, res) => {
    try {
        const userStatus = await dbController.CheckUserStatuses(req.body.userId);
        if (userStatus.isDeleted) {
            return res.status(400).send(generateResponseBody({}, messages.users.userAlreadyDeleted));
        }
        const response = await dbController.DeleteUser(req.body);
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
