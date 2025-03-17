const propertiesHelper = require('../helpers/propertiesHelper');

/**
 * Fetches all user roles.
 * @param {*} req 
 * @param {*} res 
 * @returns []
 */
const getUserRoles = async (req, res) => {
    return propertiesHelper.getUserRoles(req, res);
};

/**
 * Fetches all departments.
 * @param {*} req
 * @param {*} res
 * @returns []
 */
const getDepartments = async (req, res) => {
    return propertiesHelper.getDepartments(req, res);
}

module.exports = {
    getUserRoles,
    getDepartments,
};
