const userHelper = require('../helpers/userHelper');

const GetAllUsers = (req, res, next) => {
  return userHelper.getAllUsers(req, res, next);
};

const ApproveUser = (req, res, next) => {
  return userHelper.ApproveUser(req, res, next);
}

const SuspendUser = (req, res, next) => {
  return userHelper.SuspendUser(req, res, next);
}

const DeleteUser = (req, res, next) => {
  return userHelper.DeleteUser(req, res, next);
}

module.exports = {
  GetAllUsers,
  ApproveUser,
  SuspendUser,
  DeleteUser,
};
