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

/**
 * Creates a new department.
 * @param {*} req
 * @param {*} res
 * @returns {}
 */
const createDepartment = async (req, res) => {
    return propertiesHelper.createDepartment(req, res);
}

/**
 * Fetches all employee roles.
 * @param {*} req
 * @param {*} res
 * @returns []
 */
const getEmployeeRoles = async (req, res) => {
    return propertiesHelper.getEmployeeRoles(req, res);
}

module.exports = {
    getUserRoles,
    getDepartments,
    createDepartment,
    getEmployeeRoles,
};
