const db = require('./dbconfig');
const messages = require('../utils/messages');
const { getCurrentDateTime } = require('../utils/calendar');
const bcrypt = require('bcryptjs');
const defaultAPIUserCode = 0;
const constants = require('../utils/constants');
const { toCamelCase } = require('../utils/converters');

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
const GetUserByUsername = async (username, checkIfExists = false) => {
    return new Promise((resolve, reject) => {
        db('SystemUsers as su')
            .join('Users as u', 'su.UserId', 'u.UserId')
            .where('su.Username', username)
            .then((users) => {
                if (checkIfExists) {
                    return resolve(toCamelCase(users[0]));
                } if (users.length === 0) {
                    return reject({ code: 404, message: messages.generalResponse.noUserFound });
                } else if (users.length > 1) {
                    return reject({ code: 406, message: messages.generalResponse.multipleUsersFound });
                }
                return resolve(toCamelCase(users[0]));
            })
            .catch((error) => reject(error));
    });
};

/**
 * Function to get user by email
 * @param {string} email
 * @returns {Promise} - Resolves with the user if found, rejects with an error message otherwise
 */
const GetUserByEmail = async (email, checkIfExists = false) => {
    return new Promise((resolve, reject) => {
        db('Users')
            .where('Email', email)
            .then((users) => {
                if (checkIfExists) {
                    return resolve(toCamelCase(users[0]));
                } else if (users.length === 0) {
                    return reject({ code: 404, message: messages.generalResponse.noUserFound });
                } else if (users.length > 1) {
                    return reject({ code: 406, message: messages.generalResponse.multipleUsersFound });
                }
                return resolve(toCamelCase(users[0]));
            })
            .catch((error) => reject(error));
    });
};

/**
 * Function to get a user by identification number.
 * @param {string} identificationNumber - The identification number of the user.
 * @param {boolean} [checkIfExists=false] - If true, resolves with the user even if multiple users are found.
 * @returns {Promise} - Resolves with the user if found, rejects with an error message otherwise.
 */

const GetUserByIdentificationNumber = async (identificationNumber, checkIfExists = false) => {
    return new Promise((resolve, reject) => {
        db('Users')
            .where('IdentificationNumber', identificationNumber)
            .then((users) => {
                if (checkIfExists) {
                    return resolve(toCamelCase(users[0]));
                } else if (users.length === 0) {
                    return reject({ code: 404, message: messages.generalResponse.noUserFound });
                } else if (users.length > 1) {
                    return reject({ code: 406, message: messages.generalResponse.multipleUsersFound });
                }
                return resolve(toCamelCase(users[0]));
            })
            .catch((error) => reject(error));
    });
};

/**
 * Function to get a user by contact number.
 * @param {string} contactNumber - The contact number of the user.
 * @param {boolean} [checkIfExists=false] - If true, resolves with the user even if multiple users are found.
 * @returns {Promise} - Resolves with the user if found, rejects with an error message otherwise.
 */
const GetUserByContactNumber = async (contactNumber, checkIfExists = false) => {
    return new Promise((resolve, reject) => {
        db('Users')
            .where('ContactNumber', contactNumber)
            .then((users) => {
                if (checkIfExists) {
                    return resolve(toCamelCase(users[0]));
                } else if (users.length === 0) {
                    return reject({ code: 404, message: messages.generalResponse.noUserFound });
                } else if (users.length > 1) {
                    return reject({ code: 406, message: messages.generalResponse.multipleUsersFound });
                }
                return resolve(toCamelCase(users[0]));
            })
            .catch((error) => reject(error));
    });
}

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
                ModifiedBy: req?.authorizedUser?.userId || defaultAPIUserCode
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
                ModifiedBy: req?.authorizedUser?.userId || defaultAPIUserCode
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
                ModifiedBy: req?.authorizedUser?.userId || defaultAPIUserCode
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
            .then((roles) => resolve(toCamelCase(roles)))
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
                FirstName: user.firstName,
                LastName: user.lastName,
                IdentificationNumber: user.identificationNumber,
                ContactNumber: user.contactNumber,
                Email: user.email || null,
                IsApartment: user.isApartment || false,
                Apartment: user.apartment || null,
                Building: user.building || null,
                Street: user.street || null,
                Region: user.region || null,
                City: user.city || null,
                Country: user.country || null,
                IsForeigner: user.isForeigner || false,
            })
            .returning('*')
            .then((users) => resolve(toCamelCase(users[0])))
            .catch((error) => reject(error));
    });
};

/**
 * Function to create a new system user
 * @param {object} user
 * @returns {Promise}
 */
const CreateSystemUser = async (user, createdBy) => {
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    return new Promise((resolve, reject) => {
        db('SystemUsers')
            .insert({
                UserId: user.userId,
                UserRoleId: user.userRoleId,
                Username: user.username,
                Password: hashedPassword,
                CreatedBy: createdBy || defaultAPIUserCode,
                EmployeeRoleId: user.employeeRoleId || null,
            })
            .returning('UserId', 'Username', 'EmployeeRoleId')
            .then((users) => resolve(toCamelCase(users[0])))
            .catch((error) => reject(error));
    });
};

/**
 * Function to get all users with pagination
 * @param {Object} pagination - The pagination object containing limit and offset
 * @returns {Promise} - Resolves with a list of users
 */
const GetAllUsers = async (pagination) => {
    return new Promise((resolve, reject) => {
        db('Users as u')
            .join('SystemUsers as su', 'u.UserId', 'su.UserId')
            .select(
                'u.UserId', 'u.FirstName', 'u.LastName', 'u.Email', 'u.IsApartment', 'u.Apartment', 'u.Building', 'u.Street', 'u.Region', 'u.City', 'u.Country', 'u.IsForeigner',
                'su.UserRoleId', 'su.EmployeeRoleId',
                'su.Username', 'su.IsApproved', 'su.IsSuspended',
                'su.CreatedOn', 'su.CreatedBy', 'su.ModifiedOn', 'su.ModifiedBy'
            )
            .where('su.IsDeleted', false)
            .limit(pagination.limit)
            .offset(pagination.offset)
            .then((users) => resolve(toCamelCase(users)))
            .catch((error) => reject(error));
    });
};

/**
 * Function get system user by userId
 * @param {number} systemUserId
 * @returns {Promise}
 */
const GetSystemUserByUserId = async (userId) => {
    return new Promise((resolve, reject) => {
        db('SystemUsers')
            .where('UserId', userId)
            .then((users) => {
                if (users.length === 0) {
                    return reject({ code: 404, message: messages.generalResponse.noUserFound });
                } else if (users.length > 1) {
                    return reject({ code: 406, message: messages.generalResponse.multipleUsersFound });
                }
                return resolve(toCamelCase(users[0]));
            })
            .catch((error) => reject(error));
    });
}

/**
 * Function to get users pending approval
 * @param {Object} pagination - The pagination object containing limit and offset
 * @returns {Promise}
 */
const GetUsersPendingApproval = async (pagination) => {
    return new Promise((resolve, reject) => {
        db('Users as u')
            .join('SystemUsers as su', 'u.UserId', 'su.UserId')
            .select(
                'u.UserId', 'u.FirstName', 'u.LastName', 'u.Email',
                'su.Username', 'su.IsApproved', 'su.UserRoleId', 'su.EmployeeRoleId',
                'su.CreatedOn', 'su.CreatedBy', 'su.ModifiedOn', 'su.ModifiedBy'
            )
            .where('su.IsDeleted', false)
            .andWhere('su.IsApproved', false)
            .andWhere('su.IsSuspended', false)
            .limit(pagination.limit)
            .offset(pagination.offset)
            .then((users) => resolve(toCamelCase(users)))
            .catch((error) => reject(error));
    });
}



/**
 * Function to approve a user
 * @param {number} userId - The ID of the user to approve
 * @param {number} userRoleId - The role ID to assign to the user
 * @param {number} modifiedBy - The ID of the user who performs the approval
 * @returns {Promise} - Resolves with a success message if approved, rejects with an error message otherwise
 */
const ApproveUser = async (userId, userRoleId, modifiedBy) => {
    return new Promise((resolve, reject) => {
        db('SystemUsers')
            .where('UserId', userId)
            .update({
                IsApproved: true,
                UserRoleId: userRoleId,
                ModifiedOn: getCurrentDateTime(),
                ModifiedBy: modifiedBy
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
 * @param {Object} pagination - The pagination object containing limit and offset
 * @returns {Promise}
 */
const GetSuspendedUsers = async (pagination) => {
    return new Promise((resolve, reject) => {
        db('Users as u')
            .join('SystemUsers as su', 'u.UserId', 'su.UserId')
            .select(
                'u.UserId', 'u.FirstName', 'u.LastName', 'u.Email',
                'su.Username', 'su.IsSuspended'
            )
            .where('su.IsDeleted', false)
            .andWhere('su.IsSuspended', true)
            .limit(pagination.limit)
            .offset(pagination.offset)
            .then((users) => resolve(toCamelCase(users)))
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
                ModifiedBy: req?.authorizedUser?.userId || defaultAPIUserCode
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
            .then((users) => resolve(toCamelCase(users)))
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
                ModifiedBy: req?.authorizedUser?.userId || defaultAPIUserCode
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

/**
 * Function to get all departments
 * @returns {Promise}
 */
const GetDepartments = async () => {
    return new Promise((resolve, reject) => {
        db('Departments')
            .select('DepartmentId', 'DepartmentName', 'Description')
            .where('IsDeleted', false)
            .then((departments) => resolve(toCamelCase(departments)))
            .catch((error) => reject(error));
    });
};

/**
 * Function to get department by name
 * @param {string} name
 * @returns {Promise}
 */
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

/**
 * Function to create a department
 * @param {object} req
 * @returns {Promise}
 */
const CreateDepartment = async (req) => {
    return new Promise((resolve, reject) => {
        db('Departments')
            .insert({
                DepartmentName: req.body.departmentName,
                Description: req.body.description,
                CreatedBy: req?.authorizedUser?.userId || defaultAPIUserCode
            })
            .returning('*')
            .then((departments) => resolve(toCamelCase(departments[0])))
            .catch((error) => reject(error));
    });
};

/**
 * Function to get all employee roles
 * @returns {Promise}
 */
const GetEmployeeRoles = async () => {
    return new Promise((resolve, reject) => {
        db('EmployeeRoles')
            .select('EmployeeRoleId', 'RoleName', 'RoleDescription', 'DepartmentId')
            .where('IsDeleted', false)
            .then((roles) => resolve(toCamelCase(roles)))
            .catch((error) => reject(error));
    });
}

/**
 * Function to get employee role by role id
 * @param {string} name
 * @returns {Promise}
 */
const GetEmployeeRoleByName = async (name) => {
    return new Promise((resolve, reject) => {
        db('EmployeeRoles')
            .where('RoleName', name)
            .then((roles) => {
                return resolve(roles);
            })
            .catch((error) => reject(error));
    });
}

/**
 * Function to get employee role by role id
 * @param {string} name
 * @returns {Promise}
 */
const GetEmployeeRoleByRoleId = async (id) => {
    return new Promise((resolve, reject) => {
        db('EmployeeRoles')
            .where('EmployeeRoleId', id)
            .then((roles) => {
                return resolve(roles[0] || null);
            })
            .catch((error) => reject(error));
    });
}

/**
 * Function to create an employee role
 * @param {object} req
 * @returns {Promise}
 */
const CreateEmployeeRole = async (req) => {
    return new Promise((resolve, reject) => {
        db('EmployeeRoles')
            .insert({
                RoleName: req.body.roleName,
                RoleDescription: req.body.roleDescription,
                DepartmentId: req.body.departmentId,
                CreatedBy: req.authorizedUser.userId
            })
            .returning('*')
            .then((roles) => resolve(toCamelCase(roles[0])))
            .catch((error) => reject(error));
    });
}

/**
 * Function to get all complaints with pagination
 * @param {Object} pagination - The pagination object containing limit and offset
 * @returns {Promise} - Resolves with a list of complaints
 */
const GetAllComplaints = async (pagination) => {
    return new Promise((resolve, reject) => {
        db('Complaints as c')
            .leftJoin('Users as createdBy', 'c.CreatedBy', 'createdBy.UserId') // Join for CreatedBy
            .leftJoin('Users as assignedTo', 'c.AssignedTo', 'assignedTo.UserId') // Join for AssignedTo
            .leftJoin('Users as modifiedBy', 'c.ModifiedBy', 'modifiedBy.UserId') // Join for ModifiedBy
            .select(
                'c.*', // Select all columns from Complaints
                db.raw(`CONCAT("createdBy"."FirstName", ' ', "createdBy"."LastName") AS "CreatedByUser"`), // Concatenate CreatedBy's name
                db.raw(`CASE WHEN "c"."AssignedTo" IS NULL THEN NULL ELSE CONCAT("assignedTo"."FirstName", ' ', "assignedTo"."LastName") END AS "AssignedToUser"`), // Handle null AssignedTo
                db.raw(`CASE WHEN "c"."ModifiedBy" IS NULL THEN NULL ELSE CONCAT("modifiedBy"."FirstName", ' ', "modifiedBy"."LastName") END AS "ModifiedByUser"`) // Handle null ModifiedBy
            )
            .limit(pagination.limit)
            .offset(pagination.offset)
            .then((complaints) => resolve(toCamelCase(complaints)))
            .catch((error) => reject(error));
    });
};

/**
 * Function to create a new complaint
 * @param {*} req - The request object containing the complaint's description, type, department ID, and the user who created it
 * @param {*} res - The response object
 * @returns {Promise} - Resolves with the newly created complaint
 */
const CreateComplaint = async (req, res) => {
    return new Promise((resolve, reject) => {
        db('Complaints')
            .insert({
                ComplaintDescription: req.body.complaintDescription,
                CurrentStatus: constants.complaints.status.pending,
                ComplaintType: req.body.complaintType,
                ComplaintDepartmentId: req.body.complaintDepartmentId,
                CreatedBy: req.authorizedUser.userId,
            })
            .returning('*')
            .then((complaints) => resolve(toCamelCase(complaints[0])))
            .catch((error) => reject(error));
    });
};

/**
 * Function to get complaints by department ID
 * @param {number} departmentId - The department ID to filter by
 * @param {object} pagination - The pagination object containing the limit and offset
 * @returns {Promise} - Resolves with a list of complaints related to the specified department
 */
const GetComplaintsByDepartmentId = async (departmentId, pagination) => {
    return new Promise((resolve, reject) => {
        db('Complaints')
            .where('ComplaintDepartmentId', departmentId)
            .limit(pagination.limit)
            .offset(pagination.offset)
            .then((complaints) => resolve(toCamelCase(complaints)))
            .catch((error) => reject(error));
    });
};

/**
 * Function to get complaints by user ID
 * @param {number} userId - The ID of the user whose complaints are to be retrieved
 * @param {object} pagination - The pagination object containing limit and offset
 * @returns {Promise} - Resolves with a list of complaints created by the specified user
 */
const GetComplaintByUserId = async (userId, pagination) => {
    return new Promise((resolve, reject) => {
        db('Complaints')
            .where('CreatedBy', userId)
            .limit(pagination.limit)
            .offset(pagination.offset)
            .then((complaints) => resolve(toCamelCase(complaints)))
            .catch((error) => reject(error));
    });
};

module.exports = {
    Begin,
    Commit,
    Rollback,
    GetUserByUsername,
    GetUserByEmail,
    GetUserByIdentificationNumber,
    GetUserByContactNumber,
    UpdateResetCode,
    UpdatePasswordAgainstUsername,
    UpdateResetCodeAgainstUsername,
    GetUserRoles,
    GetUserRoleByRoleId,
    CreateUser,
    CreateSystemUser,
    GetAllUsers,
    GetSystemUserByUserId,
    GetUsersPendingApproval,
    ApproveUser,
    GetSuspendedUsers,
    SuspendUser,
    GetDeletedUsers,
    DeleteUser,
    GetDepartments,
    GetDepartmentByName,
    CreateDepartment,
    GetEmployeeRoles,
    GetEmployeeRoleByName,
    GetEmployeeRoleByRoleId,
    CreateEmployeeRole,
    GetAllComplaints,
    CreateComplaint,
    GetComplaintsByDepartmentId,
    GetComplaintByUserId,
};
