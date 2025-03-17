const db = require('./dbconfig');
const messages = require('../utils/messages');
const { getCurrentDateTime } = require('../utils/calendar');
const defaultAPIUserCode = 0;

/**
 * Function to begin a transaction
 * @returns {Promise}
 */
const Begin = async () => {
    return new Promise((resolve, reject) => {
        db.raw('BEGIN')
            .then(() => resolve())
            .catch((error) => reject(error));
    });
};

/**
 * Function to commit a transaction
 * @returns {Promise}
 */
const Commit = async () => {
    return new Promise((resolve, reject) => {
        db.raw('COMMIT')
            .then(() => resolve())
            .catch((error) => reject(error));
    });
};

/**
 * Function to rollback a transaction
 * @returns {Promise}
 */
const Rollback = async () => {
    return new Promise((resolve, reject) => {
        db.raw('ROLLBACK')
            .then(() => resolve())
            .catch((error) => reject(error));
    });
};

/**
 * Function to get user by username
 * @param {string} username
 * @returns {Promise}
 */
const GetUserByUsername = async (username) => {
    return new Promise((resolve, reject) => {
        db('SystemUsers')
            .where('Username', username)
            .then((users) => {
                if (users.length === 0) {
                    return reject({ code: 404, message: messages.generalResponse.noUserFound });
                } else if (users.length > 1) {
                    return reject({ code: 406, message: messages.generalResponse.multipleUsersFound });
                }
                return resolve(users[0]);
            })
            .catch((error) => reject(error));
    });
};

/**
 * Function to update reset code
 * @param {string} resetCode
 * @param {string} username
 * @returns {Promise}
 */
const UpdateResetCode = async (resetCode, username, req) => {
    return new Promise((resolve, reject) => {
        db('SystemUsers')
            .where('Username', username)
            .update({
                ResetCode: resetCode,
                ModifiedOn: getCurrentDateTime(),
                ModifiedBy: req?.authorizedUser?.id || defaultAPIUserCode
            })
            .then((updated) => {
                if (updated === 0) {
                    return reject({ message: messages.auth.resetToken.failed });
                }
                return resolve({ message: messages.auth.resetToken.success });
            })
            .catch((error) => reject(error));
    });
};

/**
 * Function to update password against username
 * @param {string} password
 * @param {string} username
 * @returns {Promise}
 */
const UpdatePasswordAgainstUsername = async (password, username, req) => {
    return new Promise((resolve, reject) => {
        db('SystemUsers')
            .where('Username', username)
            .update({
                Password: password,
                ModifiedOn: getCurrentDateTime(),
                ModifiedBy: req?.authorizedUser?.id || defaultAPIUserCode
            })
            .then((updated) => {
                if (updated === 0) {
                    return reject({ message: messages.auth.resetPassword.failed });
                }
                return resolve({ message: messages.auth.resetPassword.success });
            })
            .catch((error) => reject(error));
    });
}

/**
 * Function to update reset code against username
 * @param {string} resetCode
 * @param {string} username
 * @returns {Promise}
 */
const UpdateResetCodeAgainstUsername = async (resetCode, username, req) => {
    return new Promise((resolve, reject) => {
        db('SystemUsers')
            .where('Username', username)
            .update({
                ResetCode: resetCode,
                ModifiedOn: getCurrentDateTime(),
                ModifiedBy: req?.authorizedUser?.id || defaultAPIUserCode
            })
            .then((updated) => {
                if (updated === 0) {
                    return reject({ message: messages.auth.resetToken.failed });
                }
                return resolve({ message: messages.auth.resetToken.success });
            })
            .catch((error) => reject(error));
    });
}

/**
 * Function to get all user roles
 * @returns {Promise}
 */
const GetUserRoles = async () => {
    return new Promise((resolve, reject) => {
        db('UserRoles')
            .select('UserRoleId', 'UserRoleName')
            .where('IsDeleted', false)
            .then((roles) => resolve(roles))
            .catch((error) => reject(error));
    });
}

/**
 * Function to get user role by role id
 * @param {number} roleId
 * @returns {Promise}
 */
const GetUserRoleByRoleId = async (roleId) => {
    return new Promise((resolve, reject) => {
        db('UserRoles')
            .where('UserRoleId', roleId)
            .then((roles) => {
                if (roles.length === 0) {
                    return reject({ code: 404, message: messages.generalResponse.noRoleFound });
                } else if (roles.length > 1) {
                    return reject({ code: 406, message: messages.generalResponse.multipleRolesFound });
                }
                return resolve(roles[0]);
            })
            .catch((error) => reject(error));
    });
}

/**
 * Function to create a new user
 * @param {object} user
 * @returns {Promise}
 */
const CreateUser = async (user) => {
    return new Promise((resolve, reject) => {
        db('Users')
            .insert({
                FirstName: user.FirstName,
                LastName: user.LastName,
                IdentificationNumber: user.IdentificationNumber,
                ContactNumber: user.ContactNumber,
                Email: user.Email,
                IsApartment: user.IsApartment || false,
                Apartment: user.Apartment || null,
                Building: user.Building || null,
                Street: user.Street || null,
                Region: user.Region || null,
                City: user.City || null,
                Country: user.Country || null,
                IsForeigner: user.IsForeigner || false,
            })
            .returning('*')
            .then((users) => resolve(users[0]))
            .catch((error) => reject(error));
    });
};

/**
 * Function to create a new system user
 * @param {object} user
 * @returns {Promise}
 */
const CreateSystemUser = async (user, createdBy) => {
    const hashedPassword = bcrypt.hashSync(user.Password, 10);
    return new Promise((resolve, reject) => {
        db('SystemUsers')
            .insert({
                UserId: user.userId,
                UserRoleId: user.userRoleId,
                Username: user.username,
                Password: hashedPassword,
                CreatedBy: createdBy || defaultAPIUserCode
            })
            .returning('*')
            .then((users) => resolve(users[0]))
            .catch((error) => reject(error));
    });
};

/**
 * Function to get all users
 * @returns {Promise}
 */
const GetAllUsers = async () => {
    return new Promise((resolve, reject) => {
        db('Users as u')
            .join('SystemUsers as su', 'u.UserId', 'su.UserId')
            .select(
                'u.UserId', 'u.FirstName', 'u.LastName', 'u.Email', 'u.IsApartment', 'u.Apartment', 'u.Building', 'u.Street', 'u.Region', 'u.City', 'u.Country', 'u.IsForeigner',
                'su.Username', 'su.IsApproved', 'su.IsSuspended',
                'su.CreatedOn', 'su.CreatedBy', 'su.ModifiedOn', 'su.ModifiedBy'
            )
            .where('su.IsDeleted', false)
            .then((users) => resolve(users))
            .catch((error) => reject(error));
    });
};

/**
 * Function to check user statuses
 * @param {number} userId
 * @returns {Promise}
 */
const CheckUserStatuses = async (userId) => {
    return new Promise((resolve, reject) => {
        db('SystemUsers')
            .select('IsApproved', 'IsSuspended', 'IsDeleted')
            .where('UserId', userId)
            .then((users) => {
                if (users.length === 0) {
                    return reject({ code: 404, message: messages.generalResponse.noUserFound });
                } else if (users.length > 1) {
                    return reject({ code: 406, message: messages.generalResponse.multipleUsersFound });
                }
                return resolve(users[0]);
            })
            .catch((error) => reject(error));
    });
}

/**
 * Function to get users pending approval
 * @returns {Promise}
 */
const GetUsersPendingApproval = async () => {
    return new Promise((resolve, reject) => {
        db('Users as u')
            .join('SystemUsers as su', 'u.UserId', 'su.UserId')
            .select(
                'u.UserId', 'u.FirstName', 'u.LastName', 'u.Email',
                'su.Username', 'su.IsApproved',
                'su.CreatedOn', 'su.CreatedBy', 'su.ModifiedOn', 'su.ModifiedBy'
            )
            .where('su.IsDeleted', false)
            .andWhere('su.IsApproved', false)
            .andWhere('su.IsSuspended', false)
            .then((users) => resolve(users))
            .catch((error) => reject(error));
    });
}

/**
 * Function to approve a user
 * @param {object} user
 * @returns {Promise}
 */
const ApproveUser = async (req) => {
    return new Promise((resolve, reject) => {
        db('SystemUsers')
            .where('UserId', req.body.userId)
            .update({
                IsApproved: true,
                ModifiedOn: getCurrentDateTime(),
                ModifiedBy: req?.authorizedUser?.id || defaultAPIUserCode
            })
            .returning('*')
            .then((users) => {
                if (users.length === 0 || users.length > 1) {
                    return reject({ code: 404, message: messages.users.failedToApproveUser });
                }
                return resolve({ message: messages.users.userApprovedSuccessfully });
            })
            .catch((error) => reject(error));
    });
};

/**
 * Function to get suspended users
 * @returns {Promise}
 */
const GetSuspendedUsers = async () => {
    return new Promise((resolve, reject) => {
        db('Users as u')
            .join('SystemUsers as su', 'u.UserId', 'su.UserId')
            .select(
                'u.UserId', 'u.FirstName', 'u.LastName', 'u.Email',
                'su.Username', 'su.IsSuspended'
            )
            .where('su.IsDeleted', false)
            .andWhere('su.IsSuspended', true)
            .then((users) => resolve(users))
            .catch((error) => reject(error));
    });
};

/**
 * Function to suspend a user
 * @param {object} user
 * @returns {Promise}
 */
const SuspendUser = async (req) => {
    return new Promise((resolve, reject) => {
        db('SystemUsers')
            .where('UserId', req.body.userId)
            .update({
                IsSuspended: true,
                ModifiedOn: getCurrentDateTime(),
                ModifiedBy: req?.authorizedUser?.id || defaultAPIUserCode
            })
            .returning('*')
            .then((users) => {
                if (users.length === 0 || users.length > 1) {
                    return reject({ code: 404, message: messages.users.failedToSuspendUser });
                }
                return resolve({ message: messages.users.userSuspendedSuccessfully });
            })
            .catch((error) => reject(error));
    });
};

/**
 * Function to get deleted users
 * @returns {Promise}
 */
const GetDeletedUsers = async () => {
    return new Promise((resolve, reject) => {
        db('Users as u')
            .join('SystemUsers as su', 'u.UserId', 'su.UserId')
            .select(
                'u.UserId', 'u.FirstName', 'u.LastName', 'u.Email',
                'su.Username', 'su.IsDeleted'
            )
            .where('su.IsDeleted', true)
            .then((users) => resolve(users))
            .catch((error) => reject(error));
    });
};

/**
 * Function to delete a user
 * @param {object} user
 * @returns {Promise}
 */
const DeleteUser = async (req) => {
    return new Promise((resolve, reject) => {
        db('SystemUsers')
            .where('UserId', req.body.userId)
            .update({
                IsDeleted: true,
                ModifiedOn: getCurrentDateTime(),
                ModifiedBy: req?.authorizedUser?.id || defaultAPIUserCode
            })
            .returning('*')
            .then((users) => {
                if (users.length === 0 || users.length > 1) {
                    return reject({ code: 404, message: messages.users.failedToDeleteUser });
                }
                return resolve({ message: messages.users.userDeletedSuccessfully });
            })
            .catch((error) => reject(error));
    });
};

const GetDepartments = async () => {
    return new Promise((resolve, reject) => {
        db('Departments')
            .select('DepartmentId', 'DepartmentName', 'Description')
            .where('IsDeleted', false)
            .then((departments) => resolve(departments))
            .catch((error) => reject(error));
    });
};

const GetDepartmentByName = async (name) => {
    return new Promise((resolve, reject) => {
        db('Departments')
            .where('DepartmentName', name)
            .then((departments) => {
                return resolve(departments);
            })
            .catch((error) => reject(error));
    });
};

const CreateDepartment = async (req) => {
    return new Promise((resolve, reject) => {
        db('Departments')
            .insert({
                DepartmentName: req.body.departmentName,
                Description: req.body.description,
                CreatedBy: req?.authorizedUser?.id || defaultAPIUserCode
            })
            .returning('*')
            .then((departments) => resolve(departments[0]))
            .catch((error) => reject(error));
    });
};


module.exports = {
    Begin,
    Commit,
    Rollback,
    GetUserByUsername,
    UpdateResetCode,
    UpdatePasswordAgainstUsername,
    UpdateResetCodeAgainstUsername,
    GetUserRoles,
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
    GetDepartments,
    GetDepartmentByName,
    CreateDepartment,
};
