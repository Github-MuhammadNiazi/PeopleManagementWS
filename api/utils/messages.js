const { invalid } = require('joi');
const constants = require('./constants');

module.exports = {
    systemMessages: {
        unauthorizedOperation: 'You are not authorized to perform this operation',
    },
    generalResponse: {
        multipleUsersFound: `Multiple users found. Please contact ${constants.contactDetails.emails.support} or ${constants.contactDetails.phoneNumbers.support}`,
        noUserFound: 'No user found with the provided username',
        abnormalError: 'An abnormal error occurred. Please contact the system administrator',
    },
    auth: {
        connectionAuthenticated: 'Connection authenticated successfully',
        login: {
            success: 'Login successful',
            failed: 'Login failed',
            invalidUsername: 'Invalid username',
            invalidPassword: 'Invalid password',
            invalidUsernameOrPassword: 'Invalid username or password',
            accountNotApproved: `Your Account has not been approved yet. Please contact ${constants.contactDetails.emails.support} or ${constants.contactDetails.phoneNumbers.support}`,
            accountSuspended: `Your Account has been temporarily suspended. Please contact ${constants.contactDetails.emails.support} or ${constants.contactDetails.phoneNumbers.support}`,
            accountDeleted: `Your Account has been blocked. Please contact ${constants.contactDetails.emails.support} or ${constants.contactDetails.phoneNumbers.support}`,
        },
        resetToken: {
            success: 'Reset token generated successfully',
            failed: 'Failed to generate reset token',
            invalidResetTokenOrUsername: 'Invalid reset token or username',
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
    },
    users: {
        usersRetrievedSuccessfully: 'All users retrieved successfully',
        noUsersFound: 'No users found',
        failedToRetrieveAllUsers: 'Failed to retrieve all users',
        noUserFoundPendingApproval: 'No user found with pending approval',
        userAlreadyApproved: 'User already approved',
        userApprovedSuccessfully: 'User approved successfully',
        failedToApproveUser: 'Failed to approve user',
        noUserFoundWithSuspension: 'No user found with suspension',
        userAlreadySuspended: 'User already suspended',
        userSuspendedSuccessfully: 'User suspended successfully',
        failedToSuspendUser: 'Failed to suspend user',
        noUserFoundWithDeletion: 'No deleted user account found',
        userAlreadyDeleted: 'User already deleted',
        userDeletedSuccessfully: 'User deleted successfully',
        failedToDeleteUser: 'Failed to delete user',
    },
    properties: {
        userRoles: {
            allUserRolesRetrieved: 'All user roles retrieved successfully',
            noUserRoles: 'No user roles found',
            multipleUserRolesFound: `Multiple user roles found. Please contact ${constants.contactDetails.emails.support} or ${constants.contactDetails.phoneNumbers.support}`,
            failedToRetrieveAllUserRoles: 'Failed to retrieve all user roles',
        },
    }
};