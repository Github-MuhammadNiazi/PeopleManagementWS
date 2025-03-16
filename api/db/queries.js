var constants = require('../utils/constants');
const { GenerateCreateQuery, GenerateModifyQuery } = require('./dbController');

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
        createSystemUser: (req) => GenerateCreateQuery(
            `INSERT INTO ${constants.defaultConfigurations.dbSchema}."SystemUsers" ("UserId", "UserRoleId", "Username", "Password", "CreatedBy") VALUES ($1, $2, $3, $4, {{CREATED_BY}})`,
            req
        ),
        getSystemUserByUsername:
            `SELECT * FROM ${constants.defaultConfigurations.dbSchema}."SystemUsers" WHERE "Username" = $1`,
        getSystemUserByUserId:
            `SELECT * FROM ${constants.defaultConfigurations.dbSchema}."SystemUsers" WHERE "UserId" = $1`,
        updateResetCode: (req) => GenerateModifyQuery(
            `UPDATE ${constants.defaultConfigurations.dbSchema}."SystemUsers" SET "ResetCode" = $1 WHERE "Username" = $2`,
            req
        ),
        updatePassword: (req) => GenerateModifyQuery(
            `UPDATE ${constants.defaultConfigurations.dbSchema}."SystemUsers" SET "Password" = $1 WHERE "Username" = $2`,
            req
        ),
        approveUser: (req) => GenerateModifyQuery(
            `UPDATE ${constants.defaultConfigurations.dbSchema}."SystemUsers" SET "IsApproved" = true WHERE "UserId" = $1`,
            req
        ),
        suspendUser: (req) => GenerateModifyQuery(
            `UPDATE ${constants.defaultConfigurations.dbSchema}."SystemUsers" SET "IsSuspended" = true WHERE "UserId" = $1`,
            req
        ),
        deleteUser: (req) => GenerateModifyQuery(
            `UPDATE ${constants.defaultConfigurations.dbSchema}."SystemUsers" SET "IsDeleted" = true WHERE "UserId" = $1`,
            req
        ),
    },
    users: {
        createUser: `INSERT INTO ${constants.defaultConfigurations.dbSchema}."Users" ("FirstName", "LastName", "IdentificationNumber", "ContactNumber", "Email", "IsApartment", "Apartment", "Building", "Street", "Region", "City", "Country", "IsForeigner") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
        getUsersPendingApproval: `
            SELECT 
                u."UserId", u."FirstName", u."LastName", u."Email", 
                su."Username", su."IsApproved",
                su."CreatedOn", su."CreatedBy", su."ModifiedOn", su."ModifiedBy"
            FROM ${constants.defaultConfigurations.dbSchema}."Users" u
            JOIN ${constants.defaultConfigurations.dbSchema}."SystemUsers" su ON u."UserId" = su."UserId"
            WHERE su."IsDeleted" = false and su."IsApproved" = false and su."IsSuspended" = false
        `,
        getSuspendedUsers: `
            SELECT
                u."UserId", u."FirstName", u."LastName", u."Email", 
                su."Username", su."IsSuspended"
            FROM ${constants.defaultConfigurations.dbSchema}."Users" u
            JOIN ${constants.defaultConfigurations.dbSchema}."SystemUsers" su ON u."UserId" = su."UserId"
            WHERE su."IsDeleted" = false and su."IsSuspended" = true
        `,
        getDeletedUsers: `
            SELECT
                u."UserId", u."FirstName", u."LastName", u."Email", 
                su."Username", su."IsDeleted"
            FROM ${constants.defaultConfigurations.dbSchema}."Users" u
            JOIN ${constants.defaultConfigurations.dbSchema}."SystemUsers" su ON u."UserId" = su."UserId"
            WHERE su."IsDeleted" = true
        `,
        getAllUsers: `
            SELECT 
            u."UserId", u."FirstName", u."LastName", u."Email", u."IsApartment", u."Apartment", u."Building", u."Street", u."Region", u."City", u."Country", u."IsForeigner",
            su."Username", su."IsApproved", su."IsSuspended",
            su."CreatedOn", su."CreatedBy", su."ModifiedOn", su."ModifiedBy"
            FROM ${constants.defaultConfigurations.dbSchema}."Users" u
            JOIN ${constants.defaultConfigurations.dbSchema}."SystemUsers" su ON u."UserId" = su."UserId"
            WHERE su."IsDeleted" = false
        `,
        getUserByUserId: `SELECT * FROM ${constants.defaultConfigurations.dbSchema}."Users" WHERE "UserId" = $1`,
    },
};
