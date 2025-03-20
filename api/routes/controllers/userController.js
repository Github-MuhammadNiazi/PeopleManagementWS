const userHelper = require('../helpers/userHelper');

/**
 * Function to get all users
 * @param {*} req
 * @param {*} res
 * @returns {}
 */
const GetAllUsers = (req, res) => {
  return userHelper.GetAllUsers(req, res);
};

/**
 * Function to get all users pending approval
 * @param {*} req
 * @param {*} res
 * @returns {}
 */
const GetUsersPendingApproval = (req, res) => {
  return userHelper.GetUsersPendingApproval(req, res);
}

/**
 * Function to approve user
 * @param {*} req
 * @param {*} res
 * @returns {}
 */
const ApproveUser = (req, res) => {
  return userHelper.ApproveUser(req, res);
}

/**
 * Function to get all suspended users
 * @param {*} req
 * @param {*} res
 * @returns {}
 */
const GetSuspendedUsers = (req, res) => {
  return userHelper.GetSuspendedUsers(req, res);
}

/**
 * Function to suspend user
 * @param {*} req
 * @param {*} res
 * @returns {}
 */
const SuspendUser = (req, res) => {
  return userHelper.SuspendUser(req, res);
}

/**
 * Function to get all deleted users
 * @param {*} req
 * @param {*} res
 * @returns {}
 */
const GetDeletedUsers = (req, res) => {
  return userHelper.GetDeletedUsers(req, res);
}

/**
 * Function to delete user
 * @param {*} req
 * @param {*} res
 * @returns {}
 */
const DeleteUser = (req, res) => {
  return userHelper.DeleteUser(req, res);
}

module.exports = {
  GetAllUsers,
  GetUsersPendingApproval,
  ApproveUser,
  GetSuspendedUsers,
  SuspendUser,
  GetDeletedUsers,
  DeleteUser,
};
