const dbController = require('../../db/dbController');
const messages = require('../../utils/messages');
const generateResponseBody = require('../../utils/responseGenerator');
const winston = require('../../utils/winston');
const constants = require('../../utils/constants');
const { getErrorCode, getPostgresErrorCodeMessage } = require('../../utils/converters');
const { create } = require('handlebars');

/**
 * Function to get all complaints
 * @param {*} req
 * @param {*} res
 * @returns {}
 */
const GetAllComplaints = async (req, res) => {
    try {
        winston.info(`Fetching all complaints.`, { req });
        const response = await dbController.GetAllComplaints(req.pagination);
        winston.info(`${messages.complaints.complaintsRetrievedSuccessfully}, Number of Complaints: ${response.length}`, { req });
        return res.send(generateResponseBody(response, !!response.length
            ? messages.complaints.complaintsRetrievedSuccessfully
            : messages.complaints.noComplaints));
    } catch (error) {
        winston.error(`${messages.complaints.failedToRetrieveAllComplaints} Error: ${error.message}`, { req });
        winston.debug(`Error Stack: ${error.stack}`, { req });
        return res.status(getErrorCode(error, req)).send(generateResponseBody([], messages.complaints.failedToRetrieveAllComplaints, getPostgresErrorCodeMessage(error, req)));
    }
};

/**
 * Function to create a new complaint
 * @param {*} req
 * @param {*} res
 * @returns {}
 */
const CreateComplaint = async (req, res) => {
    try {
        winston.info(`Creating a new complaint.`, { req });
        const response = await dbController.CreateComplaint(req);
        winston.info(`${messages.complaints.complaintCreatedSuccessfully}, Complaint ID: ${response.complaintId}`, { req });
        return res.send(generateResponseBody(response, messages.complaints.complaintCreatedSuccessfully));
    } catch (error) {
        winston.error(`${messages.complaints.failedToCreateComplaint} Error: ${error.message}`, { req });
        winston.debug(`Error Stack: ${error.stack}`, { req });
        return res.status(getErrorCode(error, req)).send(generateResponseBody([], messages.complaints.failedToCreateComplaint, getPostgresErrorCodeMessage(error, req)));
    }
};

/**
 * Function to get complaints by department ID
 * @param {*} req - The request object containing the department ID as a parameter
 * @param {*} res - The response object
 * @returns {} - The complaints related to the specified department
 */
const GetComplaintsByDepartmentId = async (req, res) => {
    try {
        winston.info(`Fetching complaints by department ID: ${req.params.id}.`, { req });
        const response = await dbController.GetComplaintsByDepartmentId(req.params.id, req.pagination);
        winston.info(`${messages.complaints.complaintsRetrievedSuccessfully}, Number of Complaints: ${response.length}`, { req });
        return res.send(generateResponseBody(response, !!response.length
            ? messages.complaints.complaintsRetrievedSuccessfully
            : messages.complaints.noComplaints));
    } catch (error) {
        winston.error(`${messages.complaints.failedToRetrieveComplaintsByDepartmentId} Error: ${error.message}`, { req });
        winston.debug(`Error Stack: ${error.stack}`, { req });
        return res.status(getErrorCode(error, req)).send(generateResponseBody([], messages.complaints.failedToRetrieveComplaintsByDepartmentId, getPostgresErrorCodeMessage(error, req)));
    }
};

/**
 * Function to get complaints by user ID
 * @param {*} req - The request object containing the user ID as a parameter
 * @param {*} res - The response object
 * @returns {} - The complaints related to the specified user
 */
const GetComplaintByUserId = async (req, res) => {
    try {
        winston.info(`Fetching complaints by user ID: ${req.authorizedUser.userId}.`, { req });
        const response = await dbController.GetComplaintByUserId(req.authorizedUser.userId, req.pagination);
        winston.info(`${messages.complaints.complaintsRetrievedSuccessfully}, Number of Complaints: ${response.length}`, { req });
        return res.send(generateResponseBody(response, !!response.length
            ? messages.complaints.complaintsRetrievedSuccessfully
            : messages.complaints.noComplaints));
    } catch (error) {
        winston.error(`${messages.complaints.failedToRetrieveComplaintsByUserId} Error: ${error.message}`, { req });
        winston.debug(`Error Stack: ${error.stack}`, { req });
        return res.status(getErrorCode(error, req)).send(generateResponseBody([], messages.complaints.failedToRetrieveComplaintsByUserId, getPostgresErrorCodeMessage(error, req)));
    }
};

/**
 * Function to get complaints assigned to an employee
 * @param {*} req - The request object containing the user ID as a parameter
 * @param {*} res - The response object
 * @returns {} - The complaints assigned to the specified employee
 */
const GetAssignedComplaintsByEmployeeId = async (req, res) => {
    try {
        winston.info(`Fetching complaints by employee ID: ${req.params.id}.`, { req });
        const response = await dbController.GetAssignedComplaintsByEmployeeId(req.params.id, req.pagination);
        winston.info(`${messages.complaints.complaintsRetrievedSuccessfully}, Number of Complaints: ${response.length}`, { req });
        return res.send(generateResponseBody(response, !!response.length
            ? messages.complaints.complaintsRetrievedSuccessfully
            : messages.complaints.noComplaints));
    } catch (error) {
        winston.error(`${messages.complaints.failedToRetrieveComplaintsByEmployeeId} Error: ${error.message}`, { req });
        winston.debug(`Error Stack: ${error.stack}`, { req });
        return res.status(getErrorCode(error, req)).send(generateResponseBody([], messages.complaints.failedToRetrieveComplaintsByEmployeeId, getPostgresErrorCodeMessage(error, req)));
    }
};

/**
 * Function to assign a complaint to a user
 * @param {*} req - The request object containing the complaint ID and the user ID to whom the complaint is to be assigned
 * @param {*} res - The response object
 * @returns {Promise} - Resolves with the assigned complaint if successful, rejects with an error if not
 */
const AssignComplaint = async (req, res) => {
    try {
        winston.info(`Verifying if Complaint exists with ID: ${req.body.complaintId}.`, { req });
        const complaint = await dbController.GetComplaintByComplaintId(req.body.complaintId, true);
        if (!complaint) {
            winston.error(`${messages.complaints.failedToAssignComplaint} Complaint ID: ${req.body.complaintId} not found.`, { req });
            return res.status(404).send(generateResponseBody([], messages.complaints.complaintNotFound));
        }
        winston.info(`Complaint found with ID: ${req.body.complaintId}.`, { req });

        winston.info(`Verifying if User exists with ID: ${req.body.userId}.`, { req });
        const user = await dbController.GetUserByUserId(req.body.userId, true);
        if (!user) {
            winston.error(`${messages.complaints.failedToAssignComplaint} User ID: ${req.body.userId} not found.`, { req });
            return res.status(404).send(generateResponseBody([], messages.users.noUsersFound));
        }
        if (user.employeeRoleId === null) {
            winston.error(`${messages.complaints.failedToAssignComplaint} User ID: ${req.body.userId} is not an employee.`, { req });
            return res.status(404).send(generateResponseBody([], messages.complaints.complaintsCanOnlyBeAssignedToEmployees));
        }

        winston.info(`Employee found with ID: ${req.body.userId}.`, { req });

        winston.info(`Assigning complaint ID: ${req.body.complaintId} to user ID: ${req.body.userId}.`, { req });
        const response = await dbController.AssignComplaint(req.body.complaintId, req.body.userId, req.authorizedUser.userId);
        winston.info(`${messages.complaints.complaintAssignedSuccessfully}, Complaint ID: ${response.complaintId}`, { req });
        return res.send(generateResponseBody({}, messages.complaints.complaintAssignedSuccessfully));
    } catch (error) {
        winston.error(`${messages.complaints.failedToAssignComplaint} Error: ${error.message}`, { req });
        winston.debug(`Error Stack: ${error.stack}`, { req });
        return res.status(getErrorCode(error, req)).send(generateResponseBody([], messages.complaints.failedToAssignComplaint, getPostgresErrorCodeMessage(error, req)));
    }
};

/**
 * Function to get the history of a complaint
 * @param {*} req - The request object containing the complaint ID as a parameter
 * @param {*} res - The response object
 * @returns {} - The history of the specified complaint
 */
const GetComplaintHistory = async (req, res) => {
    try {
        winston.info(`Fetching complaints by complaint ID: ${req.query.id}.`, { req });
        const response = await dbController.GetComplaintByComplaintId(req.query.id, req.pagination, true);
        winston.info(`${messages.complaints.complaintRetrievedSuccessfully}`, { req });
        if (![...constants.userRoleTypes.Admin, ...constants.userRoleTypes.Staff].includes(req.authorizedUser.userRoleId)
            && response.userId !== req.authorizedUser.userId) {
            winston.error(`${messages.complaints.failedToRetrieveComplaintHistory} User ID: ${req.authorizedUser.userId} is not authorized to perform this action.`, { req });
            return res.status(403).send(generateResponseBody([], messages.complaints.notAuthorizedToViewThisComplaint));
        }
        if (!response) {
            winston.error(`${messages.complaints.failedToRetrieveComplaintHistory}, Complaint with ID: ${req.query.id} not found.`, { req });
            return res.status(404).send(generateResponseBody([], messages.complaints.complaintNotFound));
        }
        const history = await dbController.GetComplaintHistory(req.query.id);
        winston.info(`${messages.complaints.complaintHistoryRetrievedSuccessfully}, Number of Change Logs: ${history.length}`, { req });
        return res.send(generateResponseBody(history, !!history.length
            ? messages.complaints.complaintHistoryRetrievedSuccessfully
            : messages.complaints.noHistory));
    } catch (error) {
        winston.error(`${messages.complaints.failedToRetrieveComplaintHistory} Error: ${error.message}`, { req });
        winston.debug(`Error Stack: ${error.stack}`, { req });
        return res.status(getErrorCode(error, req)).send(generateResponseBody([], messages.complaints.failedToRetrieveComplaintHistory, getPostgresErrorCodeMessage(error, req)));
    }
};

/**
 * Function to create a new complaint history
 * @param {*} req - The request object containing the new history details
 * @param {*} res - The response object
 * @param {*} oldComplaint - The old complaint object
 * @returns {} - The newly created complaint history
 */
const CreateComplaintHistory = async (req, res, oldComplaint) => {
    try {
        winston.info(`Creating complaint history.`, { req });
        const response = await dbController.CreateComplaintHistory(req, oldComplaint);
        winston.info(`${messages.complaints.complaintHistoryCreatedSuccessfully}, Complaint ID: ${response.complaintId}`, { req });
        await dbController.Commit();
        return res.send(generateResponseBody({}, messages.complaints.complaintHistoryCreatedSuccessfully));
    } catch (error) {
        await dbController.Rollback();
        winston.error(`${messages.complaints.failedToCreateComplaintHistory} Error: ${error.message}`, { req });
        winston.debug(`Error Stack: ${error.stack}`, { req });
        return res.status(getErrorCode(error, req)).send(generateResponseBody([], messages.complaints.failedToCreateComplaintHistory, getPostgresErrorCodeMessage(error, req)));
    }
}

/**
 * Function to update a complaint by complaint ID
 * @param {*} req - The request object containing the complaint ID as a parameter and the updated values in the body
 * @param {*} res - The response object
 * @returns {} - The updated complaint
 */
const UpdateComplaintByComplaintId = async (req, res) => {
    try {
        winston.info(`Verifying if Complaint exists with ID: ${req.params.id}.`, { req });
        const complaint = await dbController.GetComplaintByComplaintId(req.params.id, true);
        if (!complaint) {
            winston.error(`${messages.complaints.failedToUpdateComplaint}, Complaint with ID: ${req.params.id} not found.`, { req });
            return res.status(404).send(generateResponseBody([], messages.complaints.complaintNotFound));
        }
        winston.info(`Complaint found with ID: ${req.params.id}. Detecting changes.`, { req });
        let changesDetected = false;
        if (complaint.complaintType !== req.body.complaintType) {
            req.body.changeDescription = `Complaint type changed from ${complaint.complaintType} to ${req.body.complaintType}. ` + (req.body.changeDescription || '');
            changesDetected = true;
        }
        if (complaint.complaintDepartmentId !== req.body.complaintDepartmentId) {
            req.body.changeDescription = `Complaint department changed from ${complaint.complaintDepartmentId} to ${req.body.complaintDepartmentId}. ` + (req.body.changeDescription || '');
            changesDetected = true;
        }
        if (complaint.currentStatus !== req.body.currentStatus) {
            req.body.changeDescription = `Complaint status changed from ${complaint.currentStatus} to ${req.body.currentStatus}. ` + (req.body.changeDescription || '');
            changesDetected = true;
        }
        if (!changesDetected) {
            winston.info(`No changes detected.`, { req });
            return res.status(400).send(generateResponseBody([], messages.complaints.failedToUpdateComplaint, 'No changes detected.'));
        }
        winston.info(`Updating complaint by complaint ID: ${req.params.id}.`, { req });
        await dbController.Begin();
        const response = await dbController.UpdateComplaint(req.params.id, req.body, req.authorizedUser.userId);
        winston.info(`${messages.complaints.complaintUpdatedSuccessfully}, Complaint ID: ${response.complaintId}`, { req });
        await CreateComplaintHistory(req, res, complaint);
    } catch (error) {
        await dbController.Rollback();
        winston.error(`${messages.complaints.failedToUpdateComplaint} Error: ${error.message}`, { req });
        winston.debug(`Error Stack: ${error.stack}`, { req });
        return res.status(getErrorCode(error, req)).send(generateResponseBody([], messages.complaints.failedToUpdateComplaint, getPostgresErrorCodeMessage(error, req)));
    }
};

module.exports = {
    GetAllComplaints,
    CreateComplaint,
    GetComplaintsByDepartmentId,
    GetComplaintByUserId,
    GetAssignedComplaintsByEmployeeId,
    AssignComplaint,
    GetComplaintHistory,
    UpdateComplaintByComplaintId,
};
