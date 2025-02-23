const generateResponseBody = require('../../utils/responseGenerator');

const messages = require('../../utils/messages');

// TODO: Remove after database integration
const mockData = require('../../mockData');

const getUsers = (req, res, next) => {

  // TODO: Update with database query
  const response = mockData.response.user.getUsers;
  res.send(generateResponseBody(response, messages.users.allUsersRetrieved));
};

module.exports = {
  getUsers,
};