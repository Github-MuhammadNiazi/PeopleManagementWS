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
            accountSuspended: 'Your Account has been temporarily suspended. Please contact the administrator',
            accountDeleted: 'Your Account has been blocked. Please contact the administrator',
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
