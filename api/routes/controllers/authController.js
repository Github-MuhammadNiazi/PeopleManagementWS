// Importing the authHelper module
const authHelper = require('../helpers/authHelper');

/**
 * Controller function to authenticate the connection
 * @param {*} req 
 * @param {*} res  
 * @returns {}
 */
const AuthenticateConnection = (req, res) => {
  return authHelper.AuthenticateConnection(req, res);
};

/**
 * Controller function to handle login
 * @param {*} req 
 * @param {*} res  
 * @returns {}
 */
const Login = (req, res) => {
  return authHelper.Login(req, res);
};

/**
 * Controller function to generate reset token
 * @param {*} req 
 * @param {*} res  
 * @returns {}
 */
const GenerateResetToken = (req, res) => {
  return authHelper.GenerateResetToken(req, res);
}

/**
 * Controller function to verify reset token
 * @param {*} req 
 * @param {*} res  
 * @returns {}
 */
const VerifyResetToken = (req, res) => {
  return authHelper.VerifyResetToken(req, res);
}

/**
 * Controller function to reset password
 * @param {*} req 
 * @param {*} res  
 * @returns {}
 */
const ResetPassword = (req, res) => {
  return authHelper.ResetPassword(req, res);
}

/**
 * Controller function to handle signup
 * @param {*} req
 * @param {*} res
 * @returns {}
 */
const Signup = (req, res) => {
  return authHelper.Signup(req, res);
}

module.exports = {
  AuthenticateConnection,
  Login,
  GenerateResetToken,
  VerifyResetToken,
  ResetPassword,
  Signup
};
