const pool = require('./dbconfig');
const queries = require('./queries');
const messages = require('../utils/messages');

/**
 * Function to begin a transaction
 * @returns {Promise}
 */
const Begin = async () => {
    return new Promise((resolve, reject) => {
        pool.query(queries.dbTransactions.begin, (error, results) => {
            if (error) {
                reject(error);
            }
            resolve();
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
                reject(error);
            }
            resolve();
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
                reject(error);
            }
            resolve();
        });
    }
    );
};

/**
 * Function to get user by username
 * @param {string} username
 * @returns {Promise}
 */
const GetUserByUsername = async (username) => {
    const query = queries.systemUsers.getUserByUsername;
    const values = [username];
    return new Promise((resolve, reject) => {
        pool.query(query, values, (error, results) => {
            if (error) {
                reject(error);
            } else if (results.rows.length === 0) {
                reject({ code: 404, message: messages.auth.generalResponse.noUserFound });
            } else if (results.rows.length > 1) {
                reject({ code: 406, message: messages.auth.generalResponse.multipleUsersFound });
            }
            resolve(results.rows[0]);
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
                reject(error);
            } else if (results.rows.length === 0 || results.rows.length > 1) {
                reject({ message: messages.auth.resetToken.failed });
            }
            resolve({ message: messages.auth.resetToken.success });
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
                reject(error);
            } else if (results.rows.length === 0 || results.rows.length > 1) {
                reject({ message: messages.auth.resetPassword.failed });
            }
            resolve({ message: messages.auth.resetPassword.success });
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
                reject(error);
            } else if (results.rows.length === 0 || results.rows.length > 1) {
                reject({ message: messages.auth.resetToken.failed });
            }
            resolve({ message: messages.auth.resetToken.success });
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
                reject(error);
            } else if (results.rows.length === 0) {
                reject({ message: messages.auth.signup.invalidUserRole });
            } else if (results.rows.length > 1) {
                reject({ message: messages.properties.userRoles.multipleUserRolesFound });
            }
            resolve(results.rows[0]);
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
                reject(error);
            } else if (results.rows.length === 0 || results.rows.length > 1) {
                reject({ message: messages.auth.signup.failed });
            }
            resolve(results.rows[0]);
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
    const hashedPassword = await bcrypt.hash(user.Password, 10);
    const values = [
        user.UserId,
        user.UserRoleId,
        user.Username,
        hashedPassword,
    ];
    return new Promise((resolve, reject) =>
        pool.query(query, values, (error, results) => {
            if (error) {
                reject(error);
            } else if (results.rows.length === 0 || results.rows.length > 1) {
                reject({ message: messages.auth.signup.failed });
            }
            resolve(results.rows[0]);
        })
    );
};


module.exports = {
    Begin,
    Commit,
    Rollback,
    GetUserByUsername,
    UpdateResetCode,
    UpdatePasswordAgainstUsername,
    UpdateResetCodeAgainstUsername,
    GetUserRoleByRoleId,
    CreateUser,
    CreateSystemUser,
};