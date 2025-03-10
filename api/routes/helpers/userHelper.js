const pool = require('../../db/dbconfig');
const queries = require('../../db/queries');
const messages = require('../../utils/messages');
const generateResponseBody = require('../../utils/responseGenerator');

const getAllUsers = async (req, res, next) => {
    try {
        const data = await pool.query(queries.users.getAllUsers);
        return res.send(generateResponseBody(
            data.rows,
            data.rows.length > 0
                ? messages.users.usersRetrievedSuccessfully
                : messages.users.noUsersFound))
    } catch (error) {
        return res.status(500).send(generateResponseBody(
            {},
            messages.users.failedToRetrieveAllUsers,
            error.message));
    }
};

module.exports = {
    getAllUsers,
};
