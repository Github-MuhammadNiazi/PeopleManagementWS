const dbController = require('../../db/dbController');
const messages = require('../../utils/messages');
const generateResponseBody = require('../../utils/responseGenerator');
const winston = require('../../utils/winston');
const constants = require('../../utils/constants');
const { getErrorCode, getPostgresErrorCodeMessage } = require('../../utils/converters');
const paginate = require('../../utils/pagination');


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
        winston.info(`${messages.complaints.complaintAssignedSuccessfully}, Complaint ID: ${response.ComplaintId}`, { req });
        return res.send(generateResponseBody(response, messages.complaints.complaintAssignedSuccessfully));
    } catch (error) {
        winston.error(`${messages.complaints.failedToAssignComplaint} Error: ${error.message}`, { req });
        winston.debug(`Error Stack: ${error.stack}`, { req });
        return res.status(getErrorCode(error, req)).send(generateResponseBody([], messages.complaints.failedToAssignComplaint, getPostgresErrorCodeMessage(error, req)));
    }
};

module.exports = {
    GetAllComplaints,
    CreateComplaint,
    GetComplaintsByDepartmentId,
    GetComplaintByUserId,
    GetAssignedComplaintsByEmployeeId,
    AssignComplaint,
};
