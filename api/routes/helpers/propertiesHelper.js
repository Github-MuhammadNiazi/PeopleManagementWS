const pool = require('../../db/dbconfig');
const queries = require('../../db/queries');
const messages = require('../../utils/messages');
const generateResponseBody = require('../../utils/responseGenerator');

const getUserRoles = async (req, res, next) => {
    try {
        const data = await pool.query(queries.userRoles.getAllUserRoles);
        return res.send(generateResponseBody(
            data.rows,
            data.rows.length > 0
                ? messages.properties.userRoles.allUserRolesRetrieved
                : messages.properties.userRoles.noUserRoles))
    } catch (error) {
        return res.status(500).send(generateResponseBody(
            {},
            messages.properties.userRoles.failedToRetrieveAllUserRoles,
            error.message));
    }
};

module.exports = {
    getUserRoles,
};
