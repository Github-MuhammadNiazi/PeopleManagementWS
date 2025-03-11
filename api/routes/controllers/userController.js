const userHelper = require('../helpers/userHelper');

const getAllUsers = (req, res, next) => {
  return userHelper.getAllUsers(req, res, next);
};

module.exports = {
  getAllUsers,
};
