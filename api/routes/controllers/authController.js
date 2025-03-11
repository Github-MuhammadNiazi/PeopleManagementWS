const authHelper = require('../helpers/authHelper');

const AuthenticateConnection = (req, res, next) => {
  return authHelper.AuthenticateConnection(req, res, next);
};

const Login = (req, res, next) => {
  return authHelper.Login(req, res, next);
};

const GenerateResetToken = (req, res, next) => {
  return authHelper.GenerateResetToken(req, res, next);
}

const VerifyResetToken = (req, res, next) => {
  return authHelper.VerifyResetToken(req, res, next);
}

const ResetPassword = (req, res, next) => {
  return authHelper.ResetPassword(req, res, next);
}

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
