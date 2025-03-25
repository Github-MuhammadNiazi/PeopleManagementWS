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

module.exports = {
  GetAllComplaints,
};
