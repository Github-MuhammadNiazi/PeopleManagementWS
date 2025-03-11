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
            accountNotApproved: `Your Account has not been approved yet. Please contact ${constants.contactDetails.emails.support} or ${constants.contactDetails.phoneNumbers.support}`,
            accountSuspended: `Your Account has been temporarily suspended. Please contact ${constants.contactDetails.emails.support} or ${constants.contactDetails.phoneNumbers.support}`,
            accountDeleted: `Your Account has been blocked. Please contact ${constants.contactDetails.emails.support} or ${constants.contactDetails.phoneNumbers.support}`,
        },
        resetToken: {
            success: 'Reset token generated successfully',
            failed: 'Failed to generate reset token',
            tokenInvalidOrExpired: 'Invalid or expired reset token',
            tokenVerified: 'Token verified successfully',
            tokenVerificationFailed: 'Token verification failed',
        },
        resetPassword: {
            success: 'Password reset successful',
            failed: 'Password reset failed',
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
        generalResponse: {
            multipleUsersFound: `Multiple users found. Please contact ${constants.contactDetails.emails.support} or ${constants.contactDetails.phoneNumbers.support}`,
            noUserFound: 'No user found with the provided username',
        },
    },
    users: {
        usersRetrievedSuccessfully: 'All users retrieved successfully',
        noUsersFound: 'No users found',
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