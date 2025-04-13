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
 * Function to get a user by userId
 * @param {number} userId - The ID of the user to be retrieved
 * @param {boolean} [checkIfExists=false] - If true, resolves with the user even if multiple users are found
 * @returns {Promise} - Resolves with the user if found, rejects with an error message otherwise
 */
const GetUserByUserId = async (userId, checkIfExists = false) => {
    return new Promise((resolve, reject) => {
        db('SystemUsers as su')
            .join('Users as u', 'su.UserId', 'u.UserId')
            .where('u.UserId', userId)
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
            .limit(pagination.stepCount)
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
            .limit(pagination.stepCount)
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
            .limit(pagination.stepCount)
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
 * @param {Object} pagination - The pagination object containing limit and offset
 * @returns {Promise}
 */
const GetDeletedUsers = async (pagination) => {
    return new Promise((resolve, reject) => {
        db('Users as u')
            .join('SystemUsers as su', 'u.UserId', 'su.UserId')
            .select(
                'u.UserId', 'u.FirstName', 'u.LastName', 'u.Email',
                'su.Username', 'su.IsDeleted'
            )
            .where('su.IsDeleted', true)
            .limit(pagination.stepCount)
            .offset(pagination.offset)
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
            .leftJoin('Users as uc', 'c.CreatedBy', 'uc.UserId')
            .leftJoin('Users as ua', 'c.AssignedTo', 'ua.UserId')
            .leftJoin('Users as um', 'c.ModifiedBy', 'um.UserId')
            .select(
                'c.ComplaintId', 'c.ComplaintDescription', 'c.CurrentStatus', 'c.ComplaintType',
                'c.IsResolved', 'c.Resolution', 'c.ComplaintDepartmentId', 'c.NeedsApproval',
                db.raw(`
                    (SELECT json_build_object(
                        'UserId', "uc"."UserId",
                        'name', CONCAT("uc"."FirstName", ' ', "uc"."LastName"),
                        'Email', "uc"."Email",
                        'ContactNumber', "uc"."ContactNumber"
                    )
                    FROM "Users" "uc"
                    WHERE "uc"."UserId" = "c"."CreatedBy"
                    LIMIT 1) AS "CreatedByUser"
                `),
                'c.CreatedOn',
                db.raw(`
                    (SELECT json_build_object(
                        'UserId', "ua"."UserId",
                        'name', CONCAT("ua"."FirstName", ' ', "ua"."LastName"),
                        'Email', "ua"."Email",
                        'ContactNumber', "ua"."ContactNumber"
                    )
                    FROM "Users" "ua"
                    WHERE "ua"."UserId" = "c"."AssignedTo"
                    LIMIT 1) AS "AssignedToUser"
                `),
                db.raw(`
                    (SELECT json_build_object(
                        'UserId', "um"."UserId",
                        'name', CONCAT("um"."FirstName", ' ', "um"."LastName"),
                        'Email', "um"."Email",
                        'ContactNumber', "um"."ContactNumber"
                    )
                    FROM "Users" "um"
                    WHERE "um"."UserId" = "c"."ModifiedBy"
                    LIMIT 1) AS "ModifiedByUser"
                `),
                'c.ModifiedOn',
            )
            .limit(pagination.stepCount)
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
            .limit(pagination.stepCount)
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
            .limit(pagination.stepCount)
            .offset(pagination.offset)
            .then((complaints) => resolve(toCamelCase(complaints)))
            .catch((error) => reject(error));
    });
};

/**
 * Function to get a complaint by complaint ID
 * @param {number} complaintId - The ID of the complaint to be retrieved
 * @param {boolean} [checkIfExists=false] - Whether to check if the complaint exists or not
 * @returns {Promise} - Resolves with the complaint if found, rejects with a 404 status if not found and checkIfExists is false, or a 406 status if multiple complaints are found
 */
const GetComplaintByComplaintId = async (complaintId, checkIfExists = false) => {
    return new Promise((resolve, reject) => {
        db('Complaints')
            .where('ComplaintId', complaintId)
            .then((complaints) => {
                if (checkIfExists) {
                    return resolve(toCamelCase(complaints[0]));
                } else if (complaints.length === 0) {
                    return reject({ code: 404, message: messages.generalResponse.noComplaintFound });
                } else if (complaints.length > 1) {
                    return reject({ code: 406, message: messages.generalResponse.multipleComplaintsFound });
                }
                return resolve(toCamelCase(complaints[0]));
            })
            .catch((error) => reject(error));
    });
};

/**
 * Function to get complaints assigned to a specific employee
 * @param {number} employeeId - The ID of the employee to whom the complaints are assigned
 * @param {object} pagination - The pagination object containing limit and offset
 * @returns {Promise} - Resolves with a list of complaints assigned to the specified employee
 */
const GetAssignedComplaintsByEmployeeId = async (employeeId, pagination) => {
    return new Promise((resolve, reject) => {
        db('Complaints')
            .where('AssignedTo', employeeId)
            .limit(pagination.stepCount)
            .offset(pagination.offset)
            .then((complaints) => resolve(toCamelCase(complaints)))
            .catch((error) => reject(error));
    });
};

/**
 * Function to assign a complaint to a user
 * @param {number} complaintId - The ID of the complaint to be assigned
 * @param {number} userId - The ID of the user to whom the complaint is to be assigned
 * @param {number} modifiedById - The ID of the user who is performing the assignment
 * @returns {Promise} - Resolves with the updated complaint if successful, rejects with an error if not
 */
const AssignComplaint = async (complaintId, userId, modifiedById) => {
    return new Promise((resolve, reject) => {
        db('Complaints')
            .where('ComplaintId', complaintId)
            .update({
                AssignedTo: userId,
                ModifiedOn: getCurrentDateTime(),
                ModifiedBy: modifiedById
            })
            .returning('*')
            .then((complaints) => resolve(toCamelCase(complaints[0])))
            .catch((error) => reject(error));
    });
};


/**
 * Retrieves a list of all employees with optional filters for manager status and department ID.
 * 
 * @param {Object} pagination - Pagination details including stepCount and offset.
 * @param {boolean} [isManager=false] - Filter to retrieve only managers if true; defaults to false for staff.
 * @param {number|null} [departmentId=null] - Optional department ID filter; retrieves employees from the specified department if provided.
 * @returns {Promise} - Resolves with an array of employees, each containing user details, roles, and associated metadata.
 */
const GetAllEmployees = async (pagination, isManager = false, departmentId = null) => {
    return new Promise((resolve, reject) => {
        db('Users')
            .join('SystemUsers', 'Users.UserId', 'SystemUsers.UserId')
            .join('EmployeeRoles', 'SystemUsers.EmployeeRoleId', 'EmployeeRoles.EmployeeRoleId')
            .where('SystemUsers.IsDeleted', false)
            .whereNotNull('SystemUsers.EmployeeRoleId')
            .modify((queryBuilder) => {
                if (departmentId !== null) {
                    queryBuilder.where('EmployeeRoles.DepartmentId', departmentId);
                }
            })
            .whereIn('SystemUsers.UserRoleId', isManager ? constants.userRoleTypes.Management : constants.userRoleTypes.Staff)
            .select(
                'Users.UserId', 'Users.FirstName', 'Users.LastName', 'Users.Email', 'EmployeeRoles.DepartmentId', 'SystemUsers.Username',
                'SystemUsers.IsApproved', 'SystemUsers.IsSuspended', 'SystemUsers.IsDeleted',
                'SystemUsers.CreatedOn',
                db.raw(`
                    (SELECT json_build_object(
                        'UserId', "u"."UserId",
                        'name', CONCAT("u"."FirstName", ' ', "u"."LastName"),
                        'Email', "u"."Email",
                        'IsDeleted', "su"."IsDeleted",
                        'ContactNumber', "u"."ContactNumber"
                    )
                    FROM "Users" "u"
                    JOIN "SystemUsers" "su" ON "u"."UserId" = "su"."UserId"
                    WHERE "u"."UserId" = "SystemUsers"."CreatedBy"
                    LIMIT 1) AS "CreatedByUser"
                `),
                'SystemUsers.ModifiedOn',
                db.raw(`
                    (SELECT json_build_object(
                        'UserId', "u"."UserId",
                        'name', CONCAT("u"."FirstName", ' ', "u"."LastName"),
                        'Email', "u"."Email",
                        'IsDeleted', "su"."IsDeleted",
                        'ContactNumber', "u"."ContactNumber"
                    )
                    FROM "Users" "u"
                    JOIN "SystemUsers" "su" ON "u"."UserId" = "su"."UserId"
                    WHERE "u"."UserId" = "SystemUsers"."ModifiedBy"
                    LIMIT 1) AS "ModifiedByUser"
                `),
                'SystemUsers.EmployeeRoleId', 'SystemUsers.UserRoleId'
            )
            .limit(pagination.stepCount)
            .offset(pagination.offset)
            .then((employees) => resolve(toCamelCase(employees)))
            .catch((error) => reject(error));
    });
};

/**
 * Function to get the history of a complaint
 * @param {number} complaintId - The ID of the complaint whose history is to be retrieved
 * @returns {Promise} - Resolves with the history of the specified complaint
 */
const GetComplaintHistory = async (complaintId) => {
    return new Promise((resolve, reject) => {
        db('ComplaintHistory')
            .where('ComplaintId', complaintId)
            .then((history) => resolve(toCamelCase(history)))
            .catch((error) => reject(error));
    });
};

/**
 * Function to update a complaint
 * @param {number} complaintId - The ID of the complaint to be updated
 * @param {Object} data - The updated values for the complaint
 * @param {number} modifiedById - The ID of the user making the update
 * @returns {Promise} - Resolves with the updated complaint
 */
const UpdateComplaint = async (complaintId, data, modifiedById) => {
    console.log('complaintId', complaintId);
    console.log('data', data);
    console.log('modifiedById', modifiedById);
    return new Promise((resolve, reject) => {
        db('Complaints')
            .where('ComplaintId', complaintId)
            .update({
                ComplaintType: data.complaintType,
                ComplaintDepartmentId: data.complaintDepartmentId,
                CurrentStatus: data.currentStatus,
                ModifiedOn: getCurrentDateTime(),
                ModifiedBy: modifiedById
            })
            .returning('ComplaintId')
            .then((complaints) => resolve(toCamelCase(complaints[0])))
            .catch((error) => reject(error));
    });
};

module.exports = {
    Begin,
    Commit,
    Rollback,
    GetUserByUserId,
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
    GetComplaintByComplaintId,
    GetAssignedComplaintsByEmployeeId,
    AssignComplaint,
    GetAllEmployees,
    GetComplaintHistory,
    UpdateComplaint,
};
