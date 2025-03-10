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
            if (data.rows.length > 1) {
                return res.status(500).send(generateResponseBody({}, messages.auth.generalResponse.multipleUsersFound));
            }
            const user = data.rows[0];
            const isPasswordValid = await bcrypt.compare(req.body.password, user.Password);
            if (!isPasswordValid) {
                return res.status(401).send(generateResponseBody({}, messages.auth.login.invalidPassword));
            }
            if (!user.IsApproved) {
                return res.status(401).send(generateResponseBody({}, messages.auth.login.accountNotApproved));
            } else if (user.IsSuspended) {
                return res.status(401).send(generateResponseBody({}, messages.auth.login.accountSuspended));
            } else if (user.IsDeleted) {
                return res.status(401).send(generateResponseBody({}, messages.auth.login.accountDeleted));
            }
            const token = jwt.sign({
                id: user.SystemUserId,
                username: user.Username,
                role: user.UserRoleId,
            }, process.env.JWT_SECRET, { expiresIn: constants.defaultConfigurations.tokenExpiry.accessToken });
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

const GenerateResetToken = async (req, res, next) => {
    try {
        const query = queries.systemUsers.getUserByUsername;
        const values = [req.body.username];
        const data = await pool.query(query, values);

        if (data.rows.length > 0) {
            if (data.rows.length > 1) {
                return res.status(500).send(generateResponseBody({}, messages.auth.generalResponse.multipleUsersFound));
            }

            const user = data.rows[0];
            const resetCode = Math.floor(10000 + Math.random() * 90000).toString();
            const ResetCodeToken = jwt.sign({
                username: user.Username,
                code: resetCode
            }, process.env.JWT_SECRET, { expiresIn: constants.defaultConfigurations.tokenExpiry.passwordResetToken });
            const updateQuery = queries.systemUsers.updateResetCode;
            const updateValues = [ResetCodeToken, user.Username];
            const updateResponse = await pool.query(updateQuery, updateValues);

            if (updateResponse.rows.length === 0) {
                return res.status(500).send(generateResponseBody({}, messages.auth.resetToken.failed));
            }

            return res.status(200).send(generateResponseBody({ resetCode: resetCode, token: ResetCodeToken }, messages.auth.resetToken.success));
        } else {
            return res.status(401).send(generateResponseBody({}, messages.auth.generalResponse.noUserFound));
        }
    } catch (error) {
        return res.status(500).send(generateResponseBody({}, messages.auth.resetToken.failed, error.message));
    }
};

const VerifyResetToken = async (req, res, next) => {
    try {
        const decodedToken = jwt.verify(req.body.token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).send(generateResponseBody({}, messages.auth.resetToken.tokenInvalidOrExpired));
            }
            return decoded;
        });
        const query = queries.systemUsers.getUserByUsername;
        const values = [decodedToken.username];
        const data = await pool.query(query, values);

        if (data.rows.length > 0) {
            if (data.rows.length > 1) {
                return res.status(500).send(generateResponseBody({}, messages.auth.generalResponse.multipleUsersFound));
            }
            const user = data.rows[0];
            jwt.verify(req.body.token, process.env.JWT_SECRET, (err) => {
                if (req.body.token !== user.ResetCode) {
                    return res.status(403).send(generateResponseBody({}, messages.auth.resetToken.tokenVerificationFailed));
                } else if (req.body.resetCode === jwt.verify(user.ResetCode, process.env.JWT_SECRET).code) {
                    return res.status(200).send(generateResponseBody({}, messages.auth.resetToken.tokenVerified));
                }
                return res.status(403).send(generateResponseBody({}, messages.auth.resetToken.tokenVerificationFailed));
            });
        } else {
            return res.status(401).send(generateResponseBody({}, messages.auth.generalResponse.noUserFound));
        }
    } catch (error) {
        return res.status(500).send(generateResponseBody({}, messages.auth.resetToken.tokenVerificationFailed, error.message));
    }
};

const ResetPassword = async (req, res, next) => {
    try {
        const decodedToken = jwt.verify(req.body.token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).send(generateResponseBody({}, messages.auth.resetToken.tokenInvalidOrExpired));
            }
            return decoded;
        });
        const query = queries.systemUsers.getUserByUsername;
        const values = [decodedToken.username];
        const data = await pool.query(query, values);

        if (data.rows.length > 0) {
            if (data.rows.length > 1) {
                return res.status(500).send(generateResponseBody({}, messages.auth.generalResponse.multipleUsersFound));
            }

            const user = data.rows[0];

            jwt.verify(user.ResetCode, process.env.JWT_SECRET, async (err, decoded) => {
                if (err) {
                    return res.status(403).send(generateResponseBody({}, messages.auth.resetToken.tokenInvalidOrExpired));
                }
                if (decoded.code !== req.body.resetCode) {
                    return res.status(403).send(generateResponseBody({}, messages.auth.resetToken.tokenInvalidOrExpired));
                }

                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                const updateQuery = queries.systemUsers.updatePassword;
                const updateValues = [hashedPassword, user.Username];

                // Starting transaction
                await pool.query(queries.dbTransactions.begin);
                const updateResponse = await pool.query(updateQuery, updateValues);

                if (updateResponse.rows.length === 0) {
                    await pool.query(queries.dbTransactions.rollback);
                    return res.status(500).send(generateResponseBody({}, messages.auth.resetPassword.failed));
                }

                const resetQuery = queries.systemUsers.updateResetCode;
                const resetValues = [null, user.Username];
                const resetResponse = await pool.query(resetQuery, resetValues);
                if (resetResponse.rows.length === 0) {
                    await pool.query(queries.dbTransactions.rollback);
                    return res.status(500).send(generateResponseBody({}, messages.auth.resetPassword.failed));
                }

                // Committing transaction if all operations are successful
                await pool.query(queries.dbTransactions.commit);
                return res.status(200).send(generateResponseBody({}, messages.auth.resetPassword.success));
            });
        } else {
            return res.status(401).send(generateResponseBody({}, messages.auth.generalResponse.noUserFound));
        }
    } catch (error) {
        return res.status(500).send(generateResponseBody({}, messages.auth.resetPassword.failed, error.message));
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
    GenerateResetToken,
    VerifyResetToken,
    ResetPassword,
    Signup
};
