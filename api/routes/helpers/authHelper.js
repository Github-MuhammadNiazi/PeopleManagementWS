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
const { getErrorCode, getPostgresErrorCodeMessage } = require('../../utils/converters');

/**
 * Function to authenticate the connection
 * @param {*} req
 * @param {*} res
 */
const AuthenticateConnection = (req, res) => {
    winston.info(`Connection authenticated successfully.`, { req });
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
        winston.info(`Authenticating user: ${req.body.username}`, { req });
        const user = await dbController.GetUserByUsername(req.body.username);

        if (user) {
            winston.info(`User found: ${user.username}`, { req });
            winston.info(`Checking password for user: ${user.username}`, { req });
            const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

            // Check if password is valid
            if (!isPasswordValid) {
                winston.error(`Invalid password for user: ${req.body.username}`, { req });
                return res.status(401).send(generateResponseBody({}, messages.auth.login.invalidPassword));
            }

            // Check if user is approved, suspended or deleted
            winston.info(`Checking user status for user: ${user.username}`, { req });
            if (!user.isApproved) {
                winston.error(`User not approved: ${user.username}`, { req });
                return res.status(401).send(generateResponseBody({}, messages.auth.login.accountNotApproved));
            } else if (user.isSuspended) {
                winston.error(`User suspended: ${user.username}`, { req });
                return res.status(401).send(generateResponseBody({}, messages.auth.login.accountSuspended));
            } else if (user.isDeleted) {
                winston.error(`User deleted: ${user.username}`, { req });
                return res.status(401).send(generateResponseBody({}, messages.auth.login.accountDeleted));
            }

            // Generate token
            winston.info(`Generating token for user: ${user.username}`, { req });
            const token = jwt.sign({
                userId: user.userId,
                username: user.username,
                userRoleId: user.userRoleId,
                employeeRoleId: user.employeeRoleId,
            }, process.env.JWT_SECRET, { expiresIn: constants.defaultConfigurations.tokenExpiry.accessToken });

            winston.info(`Token generated successfully for user: ${user.username}`, { req });
            return res.status(200).send(generateResponseBody({
                isEmployee: user.employeeRoleId ? true : false,
                token
            }, messages.auth.login.success));

        } else {
            winston.error(`Invalid username or password for user: ${req.body.username}`, { req });
            return res.status(401).send(generateResponseBody({}, messages.auth.login.invalidUsernameOrPassword));
        }

    } catch (error) {
        winston.debug(`Error Stack: ${error.stack}`, { req });
        return res.status(getErrorCode(error, req)).send(generateResponseBody({}, messages.auth.login.failed, getPostgresErrorCodeMessage(error, req)));
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
        winston.info(`Verifying user: ${req.body.username}`, { req });
        const user = await dbController.GetUserByUsername(req.body.username);

        if (user) {
            // Generate reset code
            winston.info(`Generating reset code for user: ${user.username}`, { req });
            const resetCode = Math.floor(10000 + Math.random() * 90000).toString();

            // Generate reset token
            winston.info(`Generating reset token for user: ${user.username}`, { req });
            const ResetCodeToken = jwt.sign({
                userId: user.userId,
                username: user.username,
                code: resetCode
            }, process.env.JWT_SECRET, { expiresIn: constants.defaultConfigurations.tokenExpiry.passwordResetToken });

            // Update reset code in database
            winston.info(`Updating reset code in database for user: ${user.username}`, { req });
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
                const errorCode = error.status || error.code;
                return res.status(errorCode >= 100 && errorCode < 600 ? error.code : 500).send(generateResponseBody({}, messages.auth.resetToken.failed));
            }
            winston.error(`Error registering reset code for user: ${req.body.username}`, { req });
            const errorCode = error.status || error.code;
            return res.status(errorCode >= 100 && errorCode < 600 ? error.code : 500).send(generateResponseBody({}, messages.auth.resetToken.failed));
        } else {
            winston.error(`No user found with username: ${req.body.username}`, { req });
            return res.status(401).send(generateResponseBody({}, messages.generalResponse.noUserFound));
        }
    } catch (error) {
        winston.error(`Error generating reset code for user: ${req.body.username}, Error: ${error.message}`, { req });
        winston.error(`Error Stack: ${error.stack}`, { req });
        return res.status(getErrorCode(error, req)).send(generateResponseBody({}, messages.auth.resetToken.failed, getPostgresErrorCodeMessage(error, req)));
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

        winston.info(`Verifying user: ${req.authorizedUser.username}`, { req });
        const user = await dbController.GetUserByUsername(req.authorizedUser.username);

        if (user) {

            // Check if reset code is consistent with the one in the database
            winston.info(`Verifying reset code for user: ${user.username}`, { req });
            if (req.authorizedUser.code === jwt.verify(user.resetCode, process.env.JWT_SECRET).code && req.body.resetCode === req.authorizedUser.code) {
                winston.info(`Reset code verified successfully for user: ${user.username}`, { req });
                return res.status(200).send(generateResponseBody({}, messages.auth.resetToken.tokenVerified));
            }

            winston.error(`Invalid reset code for user: ${user.username}`, { req });
            return res.status(404).send(generateResponseBody({}, messages.auth.resetToken.tokenVerificationFailed));
        } else {
            winston.error(`No user found with username: ${req.authorizedUser.username}`, { req });
            return res.status(401).send(generateResponseBody({}, messages.generalResponse.noUserFound));
        }
    } catch (error) {
        winston.debug(`Error Stack: ${error.stack}`, { req });
        return res.status(getErrorCode(error, req)).send(generateResponseBody({}, messages.auth.resetToken.tokenVerificationFailed, getPostgresErrorCodeMessage(error, req)));
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

        winston.info(`Verifying user: ${req.authorizedUser.username}`, { req });
        const user = await dbController.GetUserByUsername(req.authorizedUser.username);

        if (user) {
            winston.info(`User found: ${user.username}`, { req });

            if (user.resetCode === null) {
                winston.error(`Reset code does not exist for user: ${user.username}`, { req });
                return res.status(403).send(generateResponseBody({}, messages.auth.resetToken.tokenInvalidOrExpired));
            }

            // get reset token from database and verify it
            winston.info(`Validating reset code in DB for corruption for user: ${user.username}`, { req });
            jwt.verify(user.resetCode, process.env.JWT_SECRET, async (err, resetToken) => {

                if (err) {
                    winston.error(`Reset token is invalid or expired for user: ${user.username}, Error: ${err.message}`, { req });
                    return res.status(403).send(generateResponseBody({}, messages.auth.resetToken.tokenInvalidOrExpired));
                }
                winston.info(`Reset token in DB is valid for user: ${user.username}`, { req });

                // Check if reset code is consistent with the one in the database
                winston.info(`Verifying reset code for user: ${user.username}`, { req });
                if (req.authorizedUser.code !== req.body.resetCode || !(req.authorizedUser.code === resetToken.code && req.authorizedUser.username == resetToken.username)) {
                    winston.error(`Invalid reset code for user: ${user.username}`, { req });
                    return res.status(403).send(generateResponseBody({}, messages.auth.resetToken.invalidResetTokenOrUsername));
                }

                // Hash password and update in database
                winston.info(`Encrypting password for user: ${user.username}`, { req });
                const hashedPassword = await bcrypt.hash(req.body.password, 10);

                // Starting transaction
                await dbController.Begin();
                transactionStatus = true;

                winston.info(`Updating password for user: ${user.username}`, { req });
                const response = await dbController.UpdatePasswordAgainstUsername(hashedPassword, user.username);

                if (response) {
                    winston.info(`Password updated successfully for user: ${user.username}`, { req });

                    winston.info(`Removing reset code assigned to user: ${user.username}`, { req });
                    const resetResponse = await dbController.UpdateResetCode(null, user.username);
                    if (resetResponse) {
                        winston.info(`Reset code removed successfully for user: ${user.username}`, { req });

                        // Committing transaction if all operations are successful
                        winston.info(`Saving changes to database for user: ${user.username}`, { req });
                        await dbController.Commit();
                        winston.info(`Changes Saved successfully for user: ${user.username}`, { req });
                        return res.status(200).send(generateResponseBody({}, messages.auth.resetPassword.success));
                    }
                    winston.error(`Error removing reset code for user: ${user.username}`, { req });
                }
                winston.error(`Error updating password for user: ${user.username}`, { req });
                const errorCode = error.status || error.code;
                return res.status(errorCode >= 100 && errorCode < 600 ? error.code : 500).send(generateResponseBody({}, messages.auth.resetPassword.failed));

            });
        } else {
            winston.error(`No user found with username: ${req.authorizedUser.username}`, { req });
            return res.status(401).send(generateResponseBody({}, messages.generalResponse.noUserFound));
        }
    } catch (error) {
        // Rolling back transaction if any operation fails
        transactionStatus && await dbController.Rollback();
        winston.error(`Error resetting password for user: ${req.authorizedUser.username}, Error: ${error.message}`, { req });
        winston.error(`Error Stack: ${error.stack}`, { req });
        return res.status(getErrorCode(error, req)).send(generateResponseBody({}, messages.auth.resetPassword.failed, getPostgresErrorCodeMessage(error, req)));
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

        // Validating if user with same email already exists
        winston.info(`Checking if user with same email already exists.`, { req });
        const existingUser = await dbController.GetUserByEmail(req.body.email, true);
        if (existingUser) {
            winston.error(`User with same email already exists.`, { req });
            return res.status(409).send(generateResponseBody({}, messages.auth.signup.emailAlreadyExists));
        }
        winston.info(`User with same email does not exist.`, { req });

        // Validating if user with same identification number already exists
        winston.info(`Checking if user with same identification already exists.`, { req });
        const existingUserByIdentificationNumber = await dbController.GetUserByIdentificationNumber(req.body.identificationNumber, true);
        if (existingUserByIdentificationNumber) {
            winston.error(`User with same identification number already exists.`, { req });
            return res.status(409).send(generateResponseBody({}, messages.auth.signup.userAlreadyExists + `for identification number: ${req.body.identificationNumber}`));
        }
        winston.info(`User with same identification number does not exist.`, { req });

        // Validating if user with same contact number already exists
        winston.info(`Checking if user with same contact number already exists.`, { req });
        const existingUserByContactNumber = await dbController.GetUserByContactNumber(req.body.contactNumber, true);
        if (existingUserByContactNumber) {
            winston.error(`User with same contact number already exists.`, { req });
            return res.status(409).send(generateResponseBody({}, messages.auth.signup.userAlreadyExists + `for contact number: ${req.body.contactNumber}`));
        }
        winston.info(`User with same contact number does not exist.`, { req });

        // Confirming if userRole is valid
        winston.info(`Validating if user role is valid.`, { req });
        const userRole = await dbController.GetUserRoleByRoleId(req.body.userRoleId);

        // Preventing any high level account creation
        winston.info(`Checking to make sure user role is unregistered user.`, { req });
        if (!userRole || req.body.userRoleId !== constants.userRoles.UnregisteredUser) {
            winston.error(`User role is not unregistered user. Rejecting signup.`, { req });
            return res.status(401).send(generateResponseBody({}, messages.systemMessages.unauthorizedOperation));
        }
        winston.info(`User role is valid.`, { req });

        // Starting transaction
        winston.info(`Starting Signup process.`, { req });
        await dbController.Begin();
        transactionStatus = true;

        // Creating User record
        winston.info(`Creating user record.`, { req });
        const createUserResponse = await dbController.CreateUser(req.body);

        if (createUserResponse) {
            winston.info(`User record created successfully.`, { req });

            // Creating SystemUser record
            winston.info(`Creating SystemUser record for ${req.body.identificationNumber} with userId: ${createUserResponse.userId}.`, { req });
            const systemUserResponse = await dbController.CreateSystemUser({
                userId: createUserResponse.userId,
                userRoleId: req.body.userRoleId,
                username: req.body.identificationNumber,
                password: req.body.password,
            }, req?.authorizedUser?.userId || null);

            if (systemUserResponse) {
                winston.info(`SystemUser record created successfully.`, { req });

                // Committing transaction if all operations are successful
                await dbController.Commit();
                winston.info(`User successfully signed up.`, { req });
                return res.status(201).send(generateResponseBody({}, messages.auth.signup.success));
            }
            winston.error(`Error creating SystemUser record.`, { req });
        }

        winston.error(`Error creating user record.`, { req });
        return res.status(getErrorCode(error, req)).send(generateResponseBody({}, messages.auth.signup.failed));

    } catch (error) {
        transactionStatus && await dbController.Rollback();
        winston.error(`Error signing up user: ${req.body.identificationNumber}, Error: ${error.message}`, { req });
        winston.error(`Error Stack: ${error.stack}`, { req });
        return res.status(getErrorCode(error, req)).send(generateResponseBody({}, messages.auth.signup.failed, getPostgresErrorCodeMessage(error, req)));
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
