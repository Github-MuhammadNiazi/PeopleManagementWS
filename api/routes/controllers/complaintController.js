const complaintHelper = require('../helpers/complaintHelper');


/**
 * Function to get all complaints
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @returns {}
 */

const GetAllComplaints = (req, res) => {
    return complaintHelper.GetAllComplaints(req, res);
};

/**
 * Function to create a new complaint
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @returns {}
 */
const CreateComplaint = (req, res) => {
    return complaintHelper.CreateComplaint(req, res);
};

/**
 * Function to get complaints by department ID
 * @param {*} req - The request object containing the department ID as a parameter
 * @param {*} res - The response object
 * @returns {} - The complaints related to the specified department
 */
const GetComplaintsByDepartmentId = (req, res) => {
    return complaintHelper.GetComplaintsByDepartmentId(req, res);
};

/**
 * Function to get a complaint by user ID
 * @param {*} req - The request object containing the user ID as a parameter
 * @param {*} res - The response object
 * @returns {} - The complaint related to the specified user
 */
const GetComplaintByUserId = (req, res) => {
    return complaintHelper.GetComplaintByUserId(req, res);
}

/**
 * Function to get complaints assigned to an employee
 * @param {*} req - The request object containing the employee ID as a parameter
 * @param {*} res - The response object
 * @returns {} - The complaints assigned to the specified employee
 */
const GetAssignedComplaintsByEmployeeId = (req, res) => {
    return complaintHelper.GetAssignedComplaintsByEmployeeId(req, res);
}

/**
 * Function to assign a complaint to a user
 * @param {*} req - The request object containing the user ID as a parameter
 * @param {*} res - The response object
 * @returns {} - The complaint after assignment
 */
const AssignComplaint = (req, res) => {
    return complaintHelper.AssignComplaint(req, res);
};

/**
 * Function to get the history of a complaint
 * @param {*} req - The request object containing the complaint ID as a parameter
 * @param {*} res - The response object
 * @returns {} - The history of the specified complaint
 */
const GetComplaintHistory = (req, res) => {
    return complaintHelper.GetComplaintHistory(req, res);
};

/**
 * Function to update a complaint
 * @param {*} req - The request object containing the updated details of the complaint
 * @param {*} res - The response object
 * @returns {} - The updated complaint
 */
const UpdateComplaint = (req, res) => {
    return complaintHelper.UpdateComplaint(req, res);
};

module.exports = {
    GetAllComplaints,
    CreateComplaint,
    GetComplaintsByDepartmentId,
    GetComplaintByUserId,
    GetAssignedComplaintsByEmployeeId,
    AssignComplaint,
    GetComplaintHistory,
    UpdateComplaint,
};
