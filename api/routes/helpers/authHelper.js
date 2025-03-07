const pool = require('../../db/dbconfig');
const queries = require('../../db/queries');
const messages = require('../../utils/messages');
const generateResponseBody = require('../../utils/responseGenerator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const authenticateConnection = (req, res, next) => {
    res.send(generateResponseBody({}, messages.auth.connectionAuthenticated));
}

const verifyLogin = async (req, res, next) => {
    try {
        const query = queries.systemUsers.login;
        const values = [req.body.username, req.body.password];
        const data = await pool.query(query, values);

        if (data.rows.length > 0) {
            const user = data.rows[0];
            if (user.IsDeleted) {
                return res.status(401).send(generateResponseBody({}, messages.auth.accountDeleted));
            } else if (user.IsSuspended) {
                return res.status(401).send(generateResponseBody({}, messages.auth.accountSuspended));
            }
            const token = jwt.sign({
                id: user.SystemUserId,
                username: user.username,
            }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.status(200).send(generateResponseBody({
                username: user.Username,
                role: user.UserRoleId,
                token
            }, messages.auth.loginSuccess));
        } else {
            return res.status(401).send(generateResponseBody({}, messages.auth.invalidUsernameOrPassword));
        }
    } catch (error) {
        return res.status(500).send(generateResponseBody({}, messages.auth.loginFailed, error.message));
    }
};

module.exports = {
    verifyLogin,
    authenticateConnection,
};
