const dbController = require('../../db/dbController');
const messages = require('../../utils/messages');
const constants = require('../../utils/constants');
const generateResponseBody = require('../../utils/responseGenerator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendEmail } = require('../../services/emailService');
const { sendSMS } = require('../../services/smsService');
const winston = require('../../utils/winston');
const templates = require('../../services/templateService');
const Handlebars = require('handlebars');

/**
 * Function to authenticate the connection
 * @param {*} req
 * @param {*} res
 */
const AuthenticateConnection = (req, res) => {
    res.send(generateResponseBody({}, messages.auth.connectionAuthenticated));
}

/**
 * Function to handle login
 * @param {*} req
 * @param {*} res
 * @returns {}
 */
const Login = async (req, res) => {
    try {
        const user = await dbController.GetUserByUsername(req.body.username);

        if (user) {
            const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

            // Check if password is valid
            if (!isPasswordValid) {
                return res.status(401).send(generateResponseBody({}, messages.auth.login.invalidPassword));
            }

            // Check if user is approved, suspended or deleted
            if (!user.isApproved) {
                return res.status(401).send(generateResponseBody({}, messages.auth.login.accountNotApproved));
            } else if (user.isSuspended) {
                return res.status(401).send(generateResponseBody({}, messages.auth.login.accountSuspended));
            } else if (user.isDeleted) {
                return res.status(401).send(generateResponseBody({}, messages.auth.login.accountDeleted));
            }

            // Generate token
            const token = jwt.sign({
                id: user.systemUserId,
                username: user.username,
                role: user.userRoleId,
                employeeRoleId: user.employeeRoleId,
            }, process.env.JWT_SECRET, { expiresIn: constants.defaultConfigurations.tokenExpiry.accessToken });

            return res.status(200).send(generateResponseBody({
                username: user.username,
                role: user.userRoleId,
                isEmployee: user.employeeRoleId ? true : false,
                token
            }, messages.auth.login.success));

        } else {
            return res.status(401).send(generateResponseBody({}, messages.auth.login.invalidUsernameOrPassword));
        }

    } catch (error) {
        winston.debug(`Error Stack: ${error.stack}`, { req });
        return res.status(error.status || error.code || 500).send(generateResponseBody({}, messages.auth.login.failed, error.message));
    }
};

/**
 * Function to generate reset token
 * @param {*} req
 * @param {*} res
 * @returns {}
 */
const GenerateResetToken = async (req, res) => {
    try {
        const user = await dbController.GetUserByUsername(req.body.username);

        if (user) {
            // Generate reset code
            const resetCode = Math.floor(10000 + Math.random() * 90000).toString();

            // Generate reset token
            const ResetCodeToken = jwt.sign({
                id: user.systemUserId,
                username: user.username,
                code: resetCode
            }, process.env.JWT_SECRET, { expiresIn: constants.defaultConfigurations.tokenExpiry.passwordResetToken });

            // Update reset code in database
            const response = await dbController.UpdateResetCode(ResetCodeToken, user.username);

            if (response) {
                let result;
                winston.info(`Reset code generated for user: ${user.username}`, { req });
                if (req.body.sendViaSMS) {
                    winston.info(`Sending reset code to user: ${user.username} on ${user.contactNumber}`, { req });
                    const smsContent = Handlebars.compile(templates.resetCodeForPasswordTemplate.smsContent)({
                        RESET_CODE: resetCode,
                        TOKEN_EXPIRY: constants.defaultConfigurations.tokenExpiry.passwordResetToken,
                        APP_NAME: constants.defaultConfigurations.appName
                    });
                    winston.info(`Sending SMS to user: ${user.username}`, { req });
                    result = await sendSMS(user.contactNumber, smsContent);
                } else {
                    winston.info(`Sending reset code to user: ${user.username} on Email: ${user.Email}`, { req });
                    const htmlContent = Handlebars.compile(templates.resetCodeForPasswordTemplate.htmlContent)({
                        RESET_CODE: resetCode,
                        TOKEN_EXPIRY: constants.defaultConfigurations.tokenExpiry.passwordResetToken,
                        CURRENT_YEAR: new Date().getFullYear(),
                        TRADEMARK: constants.defaultConfigurations.appName
                    });
                    winston.info(`Emailing reset code to user: ${user.username}`, { req });
                    result = await sendEmail(
                        user.email,
                        templates.resetCodeForPasswordTemplate.subject,
                        htmlContent);
                }
                if (result) {
                    winston.info(`Reset code successfully sent to user: ${user.username}`, { req });
                    return res.status(200).send(generateResponseBody({ token: ResetCodeToken, result }, response.message))
                }
                winston.error(`Error sending reset code to user: ${user.username}`, { req });
                return res.status(500).send(generateResponseBody({}, messages.auth.resetToken.failed));
            }
            winston.error(`Error registering reset code for user: ${req.body.username}`, { req });
            return res.status(500).send(generateResponseBody({}, messages.auth.resetToken.failed));
        } else {
            winston.error(`No user found with username: ${req.body.username}`, { req });
            return res.status(401).send(generateResponseBody({}, messages.generalResponse.noUserFound));
        }
    } catch (error) {
        winston.error(`Error generating reset code for user: ${req.body.username}`, { req });
        winston.error(`Error Stack: ${error.stack}`, { req });
        return res.status(error.status || error.code || 500).send(generateResponseBody({}, messages.auth.resetToken.failed, error.message));
    }
};

/**
 * Function to verify reset token
 * @param {*} req
 * @param {*} res
 * @returns {}
 */
const VerifyResetToken = async (req, res) => {
    try {

        const user = await dbController.GetUserByUsername(req.authorizedUser.username);

        if (user) {

            // Check if reset code is consistent with the one in the database
            if (req.authorizedUser.code === jwt.verify(user.resetCode, process.env.JWT_SECRET).code && req.body.resetCode === req.authorizedUser.code) {
                return res.status(200).send(generateResponseBody({}, messages.auth.resetToken.tokenVerified));
            }

            return res.status(404).send(generateResponseBody({}, messages.auth.resetToken.tokenVerificationFailed));
        } else {
            return res.status(401).send(generateResponseBody({}, messages.generalResponse.noUserFound));
        }
    } catch (error) {
        winston.debug(`Error Stack: ${error.stack}`, { req });
        return res.status(error.status || error.code || 500).send(generateResponseBody({}, messages.auth.resetToken.tokenVerificationFailed, error.message));
    }
};

/**
 * Function to reset password
 * @param {*} req
 * @param {*} res
 * @returns {}
 */
const ResetPassword = async (req, res) => {
    let transactionStatus = false;
    try {

        const user = await dbController.GetUserByUsername(req.authorizedUser.username);

        if (user) {

            if (user.resetCode === null) {
                return res.status(403).send(generateResponseBody({}, messages.auth.resetToken.tokenInvalidOrExpired));
            }

            // get reset token from database and verify it
            jwt.verify(user.resetCode, process.env.JWT_SECRET, async (err, resetToken) => {

                if (err) {
                    return res.status(403).send(generateResponseBody({}, messages.auth.resetToken.tokenInvalidOrExpired));
                }

                // Check if reset code is consistent with the one in the database
                if (req.authorizedUser.code !== req.body.resetCode || !(req.authorizedUser.code === resetToken.code && req.authorizedUser.username == resetToken.username)) {
                    return res.status(403).send(generateResponseBody({}, messages.auth.resetToken.invalidResetTokenOrUsername));
                }

                // Hash password and update in database
                const hashedPassword = await bcrypt.hash(req.body.password, 10);

                // Starting transaction
                await dbController.Begin();
                transactionStatus = true;

                const response = await dbController.UpdatePasswordAgainstUsername(hashedPassword, user.username);

                if (response) {
                    const resetResponse = await dbController.UpdateResetCode(null, user.username);
                    if (resetResponse) {
                        // Committing transaction if all operations are successful
                        await dbController.Commit();
                        return res.status(200).send(generateResponseBody({}, messages.auth.resetPassword.success));
                    }
                }
                return res.status(500).send(generateResponseBody({}, messages.auth.resetPassword.failed));

            });
        } else {
            return res.status(401).send(generateResponseBody({}, messages.generalResponse.noUserFound));
        }
    } catch (error) {
        // Rolling back transaction if any operation fails
        transactionStatus && await dbController.Rollback();
        return res.status(500).send(generateResponseBody({}, messages.auth.resetPassword.failed, error.message));
    }
};

/**
 * Function to handle signup
 * @param {*} req
 * @param {*} res
 * @returns {}
 */
const Signup = async (req, res) => {
    let transactionStatus = false;
    try {

        // Confirming if userRole is valid
        const userRole = await dbController.GetUserRoleByRoleId(req.body.userRoleId);

        // Preventing any high level account creation
        if (!userRole || req.body.userRoleId !== constants.userRoles.UnregisteredUser) {
            return res.status(401).send(generateResponseBody({}, messages.systemMessages.unauthorizedOperation));
        }

        // Starting transaction
        await dbController.Begin();
        transactionStatus = true;

        // Creating User record
        const createUserResponse = dbController.CreateUser(req.body);

        if (createUserResponse) {

            // Creating SystemUser record
            const systemUserResponse = await dbController.CreateSystemUser({
                userId: createUserResponse.UserId,
                userRoleId: req.body.userRoleId,
                username: req.body.identificationNumber,
                password: req.body.password,
            }, req?.authorizedUser?.id || null);

            if (systemUserResponse) {

                // Committing transaction if all operations are successful
                await dbController.Commit();
                return res.status(201).send(generateResponseBody({}, messages.auth.signup.success));
            }
        }

        return res.status(500).send(generateResponseBody({}, messages.auth.signup.failed));

    } catch (error) {
        transactionStatus && await dbController.Rollback();
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
