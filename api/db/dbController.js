const pool = require('./dbconfig');
const queries = require('./queries');
const messages = require('../utils/messages');
const { getCurrentDateTime } = require('../utils/calendar');

/**
 * Function to begin a transaction
 * @returns {Promise}
 */
const Begin = async () => {
    return new Promise((resolve, reject) => {
        pool.query(queries.dbTransactions.begin, (error, results) => {
            if (error) {
                return reject(error);
            }
            return resolve();
        });
    }
    );
};

/**
 * Function to commit a transaction
 * @returns {Promise}
 */
const Commit = async () => {
    return new Promise((resolve, reject) => {
        pool.query(queries.dbTransactions.commit, (error, results) => {
            if (error) {
                return reject(error);
            }
            return resolve();
        });
    }
    );
};

/**
 * Function to rollback a transaction
 * @returns {Promise}
 */
const Rollback = async () => {
    return new Promise((resolve, reject) => {
        pool.query(queries.dbTransactions.rollback, (error, results) => {
            if (error) {
                return reject(error);
            }
            return resolve();
        });
    }
    );
};

/**
 * Function to generate create query
 * @param {string} query
 * @param {object} req
 * @returns {string}
 */
const GenerateCreateQuery = async (query, req) => {
    const createdBy = req?.authorizedUser?.userId || 0;
    const updatedQuery = `${query.replace("{{CREATED_BY}}", createdBy)} RETURNING *`;
    return updatedQuery
};

/**
 * Function to generate modify query
 * @param {string} query
 * @param {object} req
 * @returns {string}
 */
const GenerateModifyQuery = async (query, req) => {
    const modifiedOn = getCurrentDateTime();
    const modifiedBy = req?.authorizedUser?.userId || 0;
    const updatedQuery = `${query}, "ModifiedOn" = $${modifiedOn}, "ModifiedBy" = $${modifiedBy} RETURNING *`;
    return updatedQuery;
};

/**
 * Function to get user by username
 * @param {string} username
 * @returns {Promise}
 */
const GetUserByUsername = async (username) => {
    const query = queries.systemUsers.getSystemUserByUsername;
    const values = [username];
    return new Promise((resolve, reject) => {
        pool.query(query, values, (error, results) => {
            if (error) {
                return reject(error);
            } else if (results.rows.length === 0) {
                return reject({ code: 404, message: messages.generalResponse.noUserFound });
            } else if (results.rows.length > 1) {
                return reject({ code: 406, message: messages.generalResponse.multipleUsersFound });
            }
            return resolve(results.rows[0]);
        });
    });
};

/**
 * Function to update reset code
 * @param {string} resetCode
 * @param {string} username
 * @returns {Promise}
 */
const UpdateResetCode = async (resetCode, username) => {
    const query = queries.systemUsers.updateResetCode;
    const values = [resetCode, username];
    return new Promise((resolve, reject) =>
        pool.query(query, values, (error, results) => {
            if (error) {
                return reject(error);
            } else if (results.rows.length === 0 || results.rows.length > 1) {
                return reject({ message: messages.auth.resetToken.failed });
            }
            return resolve({ message: messages.auth.resetToken.success });
        })
    );
};

/**
 * Function to update password against username
 * @param {string} password
 * @param {string} username
 * @returns {Promise}
 */
const UpdatePasswordAgainstUsername = async (password, username) => {
    const query = queries.systemUsers.updatePassword;
    const values = [password, username];
    return new Promise((resolve, reject) =>
        pool.query(query, values, (error, results) => {
            if (error) {
                return reject(error);
            } else if (results.rows.length === 0 || results.rows.length > 1) {
                return reject({ message: messages.auth.resetPassword.failed });
            }
            return resolve({ message: messages.auth.resetPassword.success });
        })
    );
}

/**
 * Function to update reset code against username
 * @param {string} resetCode
 * @param {string} username
 * @returns {Promise}
 */
const UpdateResetCodeAgainstUsername = async (resetCode, username) => {
    const query = queries.systemUsers.updateResetCode;
    const values = [resetCode, username];
    return new Promise((resolve, reject) =>
        pool.query(query, values, (error, results) => {
            if (error) {
                return reject(error);
            } else if (results.rows.length === 0 || results.rows.length > 1) {
                return reject({ message: messages.auth.resetToken.failed });
            }
            return resolve({ message: messages.auth.resetToken.success });
        })
    );
}

/**
 * Function to get user role by role id
 * @param {number} roleId
 * @returns {Promise}
 */
const GetUserRoleByRoleId = async (roleId) => {
    const query = queries.userRoles.getUserRoleById;
    const values = [roleId];
    return new Promise((resolve, reject) =>
        pool.query(query, values, (error, results) => {
            if (error) {
                return reject(error);
            } else if (results.rows.length === 0) {
                return reject({ message: messages.auth.signup.invalidUserRole });
            } else if (results.rows.length > 1) {
                return reject({ message: messages.properties.userRoles.multipleUserRolesFound });
            }
            return resolve(results.rows[0]);
        })
    );
}

/**
 * Function to create a new user
 * @param {object} user
 * @returns {Promise}
 */
const CreateUser = async (user) => {
    const query = queries.users.createUser;
    const values = [
        user.FirstName,
        user.LastName,
        user.IdentificationNumber,
        user.ContactNumber,
        user.Email,
        user.IsApartment || false,
        user.Apartment || null,
        user.Building || null,
        user.Street || null,
        user.Region || null,
        user.City || null,
        user.Country || null,
        user.IsForeigner || false,
    ];
    return new Promise((resolve, reject) =>
        pool.query(query, values, (error, results) => {
            if (error) {
                return reject(error);
            } else if (results.rows.length === 0 || results.rows.length > 1) {
                return reject({ message: messages.auth.signup.failed });
            }
            return resolve(results.rows[0]);
        })
    );
};

/**
 * Function to create a new system user
 * @param {object} user
 * @returns {Promise}
 */
const CreateSystemUser = async (user) => {
    const query = queries.systemUsers.createSystemUser;
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const values = [
        user.userId,
        user.userRoleId,
        user.username,
        hashedPassword,
    ];
    return new Promise((resolve, reject) =>
        pool.query(query, values, (error, results) => {
            if (error) {
                return reject(error);
            } else if (results.rows.length === 0 || results.rows.length > 1) {
                return reject({ message: messages.auth.signup.failed });
            }
            return resolve(results.rows[0]);
        })
    );
};

/**
 * Function to get all users
 * @returns {Promise}
 */
const GetAllUsers = async () => {
    return new Promise((resolve, reject) => {
        pool.query(queries.users.getAllUsers, (error, results) => {
            if (error) {
                return reject(error);
            }
            return resolve(results.rows);
        });
    });
};

/**
 * Function to check user statuses
 * @param {number} userId
 * @returns {Promise}
 */
const CheckUserStatuses = async (userId) => {
    const query = queries.systemUsers.getSystemUserByUserId;
    const values = [userId];
    return new Promise((resolve, reject) =>
        pool.query(query, values, (error, results) => {
            if (error) {
                return reject(error);
            } else if (results.rows.length === 0 || results.rows.length > 1) {
                return reject({
                    code: 404,
                    message: results.rows.length
                        ? messages.generalResponse.multipleUsersFound
                        : messages.generalResponse.noUserFound
                });
            }
            return resolve({
                isApproved: results.rows[0].IsApproved,
                isSuspended: results.rows[0].IsSuspended,
                isDeleted: results.rows[0].IsDeleted,
            });
        })
    );
}

/**
 * Function to get users pending approval
 * @returns {Promise}
 */
const GetUsersPendingApproval = async () => {
    return new Promise((resolve, reject) => {
        pool.query(queries.users.getUsersPendingApproval, (error, results) => {
            if (error) {
                return reject(error);
            }
            return resolve(results.rows);
        });
    });
}

/**
 * Function to approve a user
 * @param {object} user
 * @returns {Promise}
 */
const ApproveUser = async (user) => {
    const query = queries.systemUsers.approveUser;
    const values = [user.userId];
    return new Promise((resolve, reject) =>
        pool.query(query, values, (error, results) => {
            if (error) {
                return reject(error);
            } else if (results.rows.length === 0 || results.rows.length > 1) {
                return reject({
                    code: 404,
                    message: results.rows.length
                        ? messages.generalResponse.abnormalError
                        : messages.users.failedToApproveUser
                });
            }
            return resolve({ message: messages.users.userApprovedSuccessfully });
        })
    );
};

/**
 * Function to get suspended users
 * @returns {Promise}
 */
const GetSuspendedUsers = async () => {
    return new Promise((resolve, reject) => {
        pool.query(queries.users.getSuspendedUsers, (error, results) => {
            if (error) {
                return reject(error);
            }
            return resolve(results.rows);
        });
    });
};

/**
 * Function to suspend a user
 * @param {object} user
 * @returns {Promise}
 */
const SuspendUser = async (user) => {
    const query = queries.systemUsers.suspendUser;
    const values = [user.userId];
    return new Promise((resolve, reject) =>
        pool.query(query, values, (error, results) => {
            if (error) {
                return reject(error);
            } else if (results.rows.length === 0 || results.rows.length > 1) {
                return reject({
                    code: 404,
                    message: results.rows.length
                        ? messages.generalResponse.abnormalError
                        : messages.users.failedToSuspendUser
                });
            }
            return resolve({ message: messages.users.userSuspendedSuccessfully });
        })
    );
};

/**
 * Function to get deleted users
 * @returns {Promise}
 */
const GetDeletedUsers = async () => {
    return new Promise((resolve, reject) => {
        pool.query(queries.users.getDeletedUsers, (error, results) => {
            if (error) {
                return reject(error);
            }
            return resolve(results.rows);
        });
    });
};

/**
 * Function to delete a user
 * @param {object} user
 * @returns {Promise}
 */
const DeleteUser = async (user) => {
    const query = queries.systemUsers.deleteUser;
    const values = [user.userId];
    return new Promise((resolve, reject) =>
        pool.query(query, values, (error, results) => {
            if (error) {
                return reject(error);
            } else if (results.rows.length === 0 || results.rows.length > 1) {
                return reject({
                    code: 404,
                    message: results.rows.length
                        ? messages.generalResponse.abnormalError
                        : messages.users.failedToDeleteUser
                });
            }
            return resolve({ message: messages.users.userDeletedSuccessfully });
        })
    );
};


module.exports = {
    Begin,
    Commit,
    Rollback,
    GenerateCreateQuery,
    GenerateModifyQuery,
    GetUserByUsername,
    UpdateResetCode,
    UpdatePasswordAgainstUsername,
    UpdateResetCodeAgainstUsername,
    GetUserRoleByRoleId,
    CreateUser,
    CreateSystemUser,
    GetAllUsers,
    CheckUserStatuses,
    GetUsersPendingApproval,
    ApproveUser,
    GetSuspendedUsers,
    SuspendUser,
    GetDeletedUsers,
    DeleteUser,
};
