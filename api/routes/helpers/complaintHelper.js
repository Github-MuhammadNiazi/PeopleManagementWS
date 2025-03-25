const dbController = require('../../db/dbController');
const messages = require('../../utils/messages');
const generateResponseBody = require('../../utils/responseGenerator');
const winston = require('../../utils/winston');
const constants = require('../../utils/constants');


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
    return res.status(error.status || error.code || 500).send(generateResponseBody([], messages.complaints.failedToRetrieveAllComplaints, error.message));
  }
};

module.exports = {
  GetAllComplaints,
};
