const employeeHelper = require('../helpers/employeeHelper');

/**
 * Function to get all employees
 * @param {*} req - The request object
 * @param {*} res - The response object
 * @returns {} - The list of all employees
 */
const GetAllEmployees = (req, res) => {
    return employeeHelper.GetAllEmployees(req, res);
};

/**
 * Function to create employee
 * @param {*} req
 * @param {*} res
 * @returns {}
 */
const CreateEmployee = (req, res) => {
    return employeeHelper.CreateEmployee(req, res);
};

module.exports = {
    GetAllEmployees,
    CreateEmployee,
};
