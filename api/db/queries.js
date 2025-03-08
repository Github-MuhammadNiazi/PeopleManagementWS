var constants = require('../utils/constants');

module.exports = {
    userRoles: {
        getAllUserRoles: `SELECT * FROM ${constants.defaultConfigurations.dbSchema}."UserRoles"`,
    },
    systemUsers: {
        login: `SELECT * FROM ${constants.defaultConfigurations.dbSchema}."SystemUsers" WHERE "Username" = $1 AND "Password" = $2`,
    }
};
