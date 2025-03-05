const propertiesHelper = require('../helpers/propertiesHelper');

const getUserRoles = async (req, res, next) => {
    return propertiesHelper.getUserRoles(req, res, next);
};

module.exports = {
    getUserRoles,
};