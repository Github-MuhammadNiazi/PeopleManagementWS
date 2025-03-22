const dbController = require('../../db/dbController');
const messages = require('../../utils/messages');
const constants = require('../../utils/constants');
const generateResponseBody = require('../../utils/responseGenerator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendEmail } = require('../../utils/emailService');
const winston = require('../../utils/winston');

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
            const isPasswordValid = await bcrypt.compare(req.body.password, user.Password);

            // Check if password is valid
            if (!isPasswordValid) {
                return res.status(401).send(generateResponseBody({}, messages.auth.login.invalidPassword));
            }

            // Check if user is approved, suspended or deleted
            if (!user.IsApproved) {
                return res.status(401).send(generateResponseBody({}, messages.auth.login.accountNotApproved));
            } else if (user.IsSuspended) {
                return res.status(401).send(generateResponseBody({}, messages.auth.login.accountSuspended));
            } else if (user.IsDeleted) {
                return res.status(401).send(generateResponseBody({}, messages.auth.login.accountDeleted));
            }

            // Generate token
            const token = jwt.sign({
                id: user.SystemUserId,
                username: user.Username,
                role: user.UserRoleId,
                employeeRoleId: user.EmployeeRoleId,
            }, process.env.JWT_SECRET, { expiresIn: constants.defaultConfigurations.tokenExpiry.accessToken });

            return res.status(200).send(generateResponseBody({
                username: user.Username,
                role: user.UserRoleId,
                isEmployee: user.EmployeeRoleId ? true : false,
                token
            }, messages.auth.login.success));

        } else {
            return res.status(401).send(generateResponseBody({}, messages.auth.login.invalidUsernameOrPassword));
        }

    } catch (error) {
        return res.status(error.code || 500).send(generateResponseBody({}, messages.auth.login.failed, error.message));
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
                username: user.Username,
                code: resetCode
            }, process.env.JWT_SECRET, { expiresIn: constants.defaultConfigurations.tokenExpiry.passwordResetToken });

            // Update reset code in database
            const response = await dbController.UpdateResetCode(ResetCodeToken, user.Username);

            if (response) {
                winston.info(`Reset code generated for user: ${user.Username}`, { req });
                winston.info(`Emailing reset code to user: ${user.Username}`, { req });
                // TODO: Generate a component to handle emails.
                const result = await sendEmail(
                    user.Email,
                    'Reset People Management WS Password for ' + user.Username,
                    `<h1>Your reset code for ${constants.defaultConfigurations.appName} Login</h1>
                    <h2>Please reach out to support if you did not request this reset code.</h2>
                    <p>Please use this code to reset your password.</p><h2>Reset Code: ${resetCode} </h2>`);
                return res.status(200).send(generateResponseBody({ token: ResetCodeToken, result }, response.message));
            }
            return res.status(500).send(generateResponseBody({}, messages.auth.resetToken.failed));
        } else {
            return res.status(401).send(generateResponseBody({}, messages.generalResponse.noUserFound));
        }
    } catch (error) {
        return res.status(error.code || 500).send(generateResponseBody({}, messages.auth.resetToken.failed, error.message));
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
            if (req.authorizedUser.code === jwt.verify(user.ResetCode, process.env.JWT_SECRET).code && req.body.resetCode === req.authorizedUser.code) {
                return res.status(200).send(generateResponseBody({}, messages.auth.resetToken.tokenVerified));
            }

            return res.status(404).send(generateResponseBody({}, messages.auth.resetToken.tokenVerificationFailed));
        } else {
            return res.status(401).send(generateResponseBody({}, messages.generalResponse.noUserFound));
        }
    } catch (error) {
        return res.status(error.code || 500).send(generateResponseBody({}, messages.auth.resetToken.tokenVerificationFailed, error.message));
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

            if (user.ResetCode === null) {
                return res.status(403).send(generateResponseBody({}, messages.auth.resetToken.tokenInvalidOrExpired));
            }

            // get reset token from database and verify it
            jwt.verify(user.ResetCode, process.env.JWT_SECRET, async (err, resetToken) => {

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

                const response = await dbController.UpdatePasswordAgainstUsername(hashedPassword, user.Username);

                if (response) {
                    const resetResponse = await dbController.UpdateResetCode(null, user.Username);
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
