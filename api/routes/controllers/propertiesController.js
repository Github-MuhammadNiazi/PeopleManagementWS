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

module.exports = {
    getUserRoles,
};
