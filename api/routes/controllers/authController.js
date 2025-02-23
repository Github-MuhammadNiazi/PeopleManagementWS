const generateResponseBody = require('../../utils/responseGenerator');

const messages = require('../../utils/messages');
const { verifyLogin } = require('../../mockData');

const authenticateConnection = (req, res, next) => {
  res.send(generateResponseBody({}, messages.auth.connectionAuthenticated));
};

const login = (req, res, next) => {
  if (verifyLogin(req)) {
    return res.send(generateResponseBody(req.body, messages.auth.loginSuccess));
  }
  return res.status(401).send(generateResponseBody({}, messages.auth.loginFailed, messages.auth.invalidUsernameOrPassword));
};

module.exports = {
  authenticateConnection,
  login
};