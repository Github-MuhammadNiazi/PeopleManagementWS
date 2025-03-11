const dbController = require('../../db/dbController');
const messages = require('../../utils/messages');
const generateResponseBody = require('../../utils/responseGenerator');

const GetAllUsers = async (req, res) => {
    try {
        const response = await dbController.GetAllUsers();
        return res.send(generateResponseBody(response, messages.users.usersRetrievedSuccessfully))
    } catch (error) {
        return res.status(error.code || 500).send(generateResponseBody({}, messages.users.failedToRetrieveAllUsers, error.message));
    }
};

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
    ApproveUser,
    SuspendUser,
    DeleteUser,
};
