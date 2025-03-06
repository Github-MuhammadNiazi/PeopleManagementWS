const pool = require('../../db/dbconfig');
const queries = require('../../db/queries');
const messages = require('../../utils/messages');
const generateResponseBody = require('../../utils/responseGenerator');

const authenticateConnection = (req, res, next) => {
    res.send(generateResponseBody({}, messages.auth.connectionAuthenticated));
}

const verifyLogin = async (req, res, next) => {
    try {
        const query = queries.systemUsers.login;
        const values = [req.body.username, req.body.password];
        const data = await pool.query(query, values);
        return res
            .status(data.rows.length ? 200 : 401)
            .send(generateResponseBody(
                data.rows,
                data.rows.length > 0
                    ? messages.auth.loginSuccess
                    : messages.auth.invalidUsernameOrPassword))
    } catch (error) {
        return res.status(500).send(generateResponseBody(
            {},
            messages.auth.loginFailed,
            error.message));
    }
};

module.exports = {
    verifyLogin,
    authenticateConnection,
};
