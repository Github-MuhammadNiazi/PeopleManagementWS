const pool = require('../../db/dbconfig');
const queries = require('../../db/queries');
const messages = require('../../utils/messages');
const constants = require('../../utils/constants');
const generateResponseBody = require('../../utils/responseGenerator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const AuthenticateConnection = (req, res, next) => {
    res.send(generateResponseBody({}, messages.auth.connectionAuthenticated));
}

const Login = async (req, res, next) => {
    try {
        const query = queries.systemUsers.getUserByUsername;
        const values = [req.body.username];
        const data = await pool.query(query, values);

        if (data.rows.length > 0) {
            const user = data.rows[0];
            const isPasswordValid = await bcrypt.compare(req.body.password, user.Password);
            if (!isPasswordValid) {
                return res.status(401).send(generateResponseBody({}, messages.auth.login.invalidPassword));
            }
            if (user.IsDeleted) {
                return res.status(401).send(generateResponseBody({}, messages.auth.login.accountDeleted));
            } else if (user.IsSuspended) {
                return res.status(401).send(generateResponseBody({}, messages.auth.login.accountSuspended));
            }
            const token = jwt.sign({
                id: user.SystemUserId,
                username: user.Username,
                role: user.UserRoleId,
            }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.status(200).send(generateResponseBody({
                username: user.Username,
                role: user.UserRoleId,
                token
            }, messages.auth.login.success));
        } else {
            return res.status(401).send(generateResponseBody({}, messages.auth.login.invalidUsernameOrPassword));
        }
    } catch (error) {
        return res.status(500).send(generateResponseBody({}, messages.auth.login.failed, error.message));
    }
};

const Signup = async (req, res, next) => {
    try {
        // Confirming if userRole is valid
        const userRoleQuery = queries.userRoles.getUserRoleById;
        const userRoleValues = [req.body.userRoleId];
        const userRoleData = await pool.query(userRoleQuery, userRoleValues);
        if (userRoleData.rows.length === 0 || userRoleData.rows.length > 1) {
            return res.status(400).send(generateResponseBody({}, messages.auth.signup.invalidUserRole));
        }
        
        // Preventing any high level account creation
        if (req.body.userRoleId !== constants.userRoles.UnregisteredUser) {
            return res.status(401).send(generateResponseBody({}, messages.systemMessages.unauthorizedOperation));
        }
        
        // Starting transaction
        await pool.query(queries.dbTransactions.begin);

        // Creating User record
        const userQuery = queries.Users.createUser;
        const userValues = [
            req.body.firstName,
            req.body.lastName,
            req.body.identificationNumber,
            req.body.contactNumber,
            req.body.email,
            req.body.isApartment || false,
            req.body.apartment || null,
            req.body.building || null,
            req.body.street || null,
            req.body.region || null,
            req.body.city || null,
            req.body.country || null,
            req.body.isForeigner || false,
        ];
        const userResponse = await pool.query(userQuery, userValues);

        // Rolling back transaction if user creation fails
        if (userResponse.rows.length === 0) {
            await pool.query(queries.dbTransactions.rollback);
            return res.status(500).send(generateResponseBody({}, messages.auth.signup.failed));
        }

        // Creating SystemUser record
        const systemUserQuery = queries.systemUsers.createSystemUser;
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const systemUserValues = [
            userResponse.rows[0].UserId,
            req.body.userRoleId,
            req.body.identificationNumber,
            hashedPassword,
        ];
        const systemUserResponse = await pool.query(systemUserQuery, systemUserValues);

        // Rolling back transaction if system user creation fails
        if (systemUserResponse.rows.length === 0 || systemUserResponse.rows.length > 1) {
            await pool.query(queries.dbTransactions.rollback);
            return res.status(500).send(generateResponseBody({}, messages.auth.signup.failed));
        }

        // Committing transaction if all operations are successful
        await pool.query(queries.dbTransactions.commit);
        return res.status(201).send(generateResponseBody({}, messages.auth.signup.success));
    } catch (error) {
        await pool.query(queries.dbTransactions.rollback);
        return res.status(500).send(generateResponseBody({}, messages.auth.signup.failed, error.message));
    }
};
module.exports = {
    AuthenticateConnection,
    Login,
    Signup
};
