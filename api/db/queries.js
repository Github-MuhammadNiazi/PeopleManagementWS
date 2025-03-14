var constants = require('../utils/constants');

module.exports = {
    dbTransactions: {
        begin: `BEGIN`,
        commit: `COMMIT`,
        rollback: `ROLLBACK`,
    },
    userRoles: {
        getAllUserRoles: `SELECT * FROM ${constants.defaultConfigurations.dbSchema}."UserRoles"`,
        getUserRoleById: `SELECT * FROM ${constants.defaultConfigurations.dbSchema}."UserRoles" WHERE "UserRoleId" = $1`,
    },
    systemUsers: {
        createSystemUser: `INSERT INTO ${constants.defaultConfigurations.dbSchema}."SystemUsers" ("UserId", "UserRoleId", "Username", "Password") VALUES ($1, $2, $3, $4) RETURNING *`,
        getSystemUserByUsername: `SELECT * FROM ${constants.defaultConfigurations.dbSchema}."SystemUsers" WHERE "Username" = $1`,
        getSystemUserByUserId: `SELECT * FROM ${constants.defaultConfigurations.dbSchema}."SystemUsers" WHERE "UserId" = $1`,
        updateResetCode: `UPDATE ${constants.defaultConfigurations.dbSchema}."SystemUsers" SET "ResetCode" = $1 WHERE "Username" = $2 RETURNING *`,
        updatePassword: `UPDATE ${constants.defaultConfigurations.dbSchema}."SystemUsers" SET "Password" = $1 WHERE "Username" = $2 RETURNING *`,
        approveUser: `UPDATE ${constants.defaultConfigurations.dbSchema}."SystemUsers" SET "IsApproved" = true WHERE "UserId" = $1 RETURNING *`,
        suspendUser: `UPDATE ${constants.defaultConfigurations.dbSchema}."SystemUsers" SET "IsSuspended" = true WHERE "UserId" = $1 RETURNING *`,
        deleteUser: `UPDATE ${constants.defaultConfigurations.dbSchema}."SystemUsers" SET "IsDeleted" = true WHERE "UserId" = $1 RETURNING *`,
    },
    users: {
        createUser: `INSERT INTO ${constants.defaultConfigurations.dbSchema}."Users" ("FirstName", "LastName", "IdentificationNumber", "ContactNumber", "Email", "IsApartment", "Apartment", "Building", "Street", "Region", "City", "Country", "IsForeigner") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
        getAllUsers: `SELECT * FROM ${constants.defaultConfigurations.dbSchema}."Users"`,
        getUserByUserId: `SELECT * FROM ${constants.defaultConfigurations.dbSchema}."Users" WHERE "UserId" = $1`,
    }
};
