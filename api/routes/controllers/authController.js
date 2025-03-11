// Importing the authHelper module
const authHelper = require('../helpers/authHelper');

/**
 * Controller function to authenticate the connection
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {}
 */
const AuthenticateConnection = (req, res, next) => {
  return authHelper.AuthenticateConnection(req, res, next);
};

/**
 * Controller function to handle login
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {}
 */
const Login = (req, res, next) => {
  return authHelper.Login(req, res, next);
};

/**
 * Controller function to generate reset token
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {}
 */
const GenerateResetToken = (req, res, next) => {
  return authHelper.GenerateResetToken(req, res, next);
}

/**
 * Controller function to verify reset token
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {}
 */
const VerifyResetToken = (req, res, next) => {
  return authHelper.VerifyResetToken(req, res, next);
}

/**
 * Controller function to reset password
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {}
 */
const ResetPassword = (req, res, next) => {
  return authHelper.ResetPassword(req, res, next);
}

/**
 * Controller function to handle signup
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {}
 */
const Signup = (req, res, next) => {
  return authHelper.Signup(req, res, next);
}

module.exports = {
  AuthenticateConnection,
  Login,
  GenerateResetToken,
  VerifyResetToken,
  ResetPassword,
  Signup
};
