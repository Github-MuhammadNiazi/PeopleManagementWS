var packageJson = require('../package.json');

module.exports = {
    userRoles: {
        getAllUserRoles: `SELECT * FROM ${packageJson.dbSchema}."UserRoles"`,
    },
    systemUsers: {
        login: `SELECT * FROM ${packageJson.dbSchema}."SystemUsers" WHERE "Username" = {{username}} AND "Password" = {{password}}`,
    }
};