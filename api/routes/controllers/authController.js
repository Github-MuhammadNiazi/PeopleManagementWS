const authHelper = require('../helpers/authHelper');

const authenticateConnection = (req, res, next) => {
  return authHelper.authenticateConnection(req, res, next);
};

const login = (req, res, next) => {
  return authHelper.verifyLogin(req, res, next);
};

module.exports = {
  authenticateConnection,
  login
};
