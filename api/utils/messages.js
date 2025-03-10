const constants = require('./constants');

module.exports = {
    systemMessages: {
        unauthorizedOperation: 'You are not authorized to perform this operation',
    },
    auth: {
        connectionAuthenticated: 'Connection authenticated successfully',
        login: {
            success: 'Login successful',
            failed: 'Login failed',
            invalidPassword: 'You have entered an invalid password',
            invalidUsernameOrPassword: 'Invalid username or password',
            multipleUsersFound: `Multiple users found. Please contact at ${constants.contactDetails.emails.support} or ${constants.contactDetails.phoneNumbers.support}`,
            accountNotApproved: `Your Account has not been approved yet. Please contact at ${constants.contactDetails.emails.support} or ${constants.contactDetails.phoneNumbers.support}`,
            accountSuspended: `Your Account has been temporarily suspended. Please contact at ${constants.contactDetails.emails.support} or ${constants.contactDetails.phoneNumbers.support}`,
            accountDeleted: `Your Account has been blocked. Please contact at ${constants.contactDetails.emails.support} or ${constants.contactDetails.phoneNumbers.support}`,
        },
        signup: {
            success: 'Signup successful',
            failed: 'Signup failed',
            invalidUserRole: 'Invalid user role',
        },
        token: {
            noTokenProvided: 'No token provided',
            failedToAuthenticateToken: 'Failed to authenticate jwt token',
        },
    },
    users: {
        allUsersRetrieved: 'All users retrieved successfully',
        failedToRetrieveAllUsers: 'Failed to retrieve all users',
    },
    properties: {
        userRoles: {
            allUserRolesRetrieved: 'All user roles retrieved successfully',
            noUserRoles: 'No user roles found',
            failedToRetrieveAllUserRoles: 'Failed to retrieve all user roles',
        },
    }
};
