const dbController = require('../../db/dbController');
const messages = require('../../utils/messages');
const generateResponseBody = require('../../utils/responseGenerator');
const winston = require('../../utils/winston');
const constants = require('../../utils/constants');
const { getErrorCode, getPostgresErrorCodeMessage } = require('../../utils/converters');


/**
 * Function to get all complaints
 * @param {*} req
 * @param {*} res
 * @returns {}
 */
const GetAllComplaints = async (req, res) => {
    try {
        winston.info(`Fetching all complaints.`, { req });
        const response = await dbController.GetAllComplaints();
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
        winston.info(`${messages.complaints.complaintCreatedSuccessfully}, Complaint ID: ${response.ComplaintId}`, { req });
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
        const response = await dbController.GetComplaintsByDepartmentId(req.params.id);
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
        const response = await dbController.GetComplaintByUserId(req.authorizedUser.userId);
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

module.exports = {
    GetAllComplaints,
    CreateComplaint,
    GetComplaintsByDepartmentId,
    GetComplaintByUserId,
};
