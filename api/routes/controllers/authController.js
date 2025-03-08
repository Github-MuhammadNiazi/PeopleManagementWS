const authHelper = require('../helpers/authHelper');

const AuthenticateConnection = (req, res, next) => {
  return authHelper.AuthenticateConnection(req, res, next);
};

const Login = (req, res, next) => {
  return authHelper.Login(req, res, next);
};

const Signup = (req, res, next) => {
  return authHelper.Signup(req, res, next);
}

module.exports = {
  AuthenticateConnection,
  Login,
  Signup
};
