const generateResponseBody = require('../../utils/responseGenerator');

const messages = require('../../utils/messages');

const authenticateConnection = (req, res, next) => {
  res.send(generateResponseBody({}, messages.auth.connectionAuthenticated));
};

module.exports = {
    authenticateConnection,
};