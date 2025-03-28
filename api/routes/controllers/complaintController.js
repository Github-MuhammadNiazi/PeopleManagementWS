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

module.exports = {
    GetAllComplaints,
    CreateComplaint,
    GetComplaintsByDepartmentId,
    GetComplaintByUserId,
};
