const defaultConfigurations = {
    apiPrefix: '/api',
    apiVersion: 'v1.0',
    defaultPort: 3000,
    dbSchema: 'public',
    logsFilePath: 'logs',
    tokenExpiry: {
        accessToken: '2h',
        passwordResetToken: '1h',
    }
}

const contactDetails = {
    emails: {
        support: 'support@support.com'
    },
    phoneNumbers: {
        support: '+1234567890'
    },
}

const userRoleTypes = {
    Residents: [1, 4, 5],
    Staff: [1, 2, 3],
    Management: [1, 2],
}

const userRoles = {
    Admin: 1,
    ManagementUser: 2,
    OperatingUser: 3,
    ResidentUser: 4,
    RegisteredUser: 5,
    UnregisteredUser: 6,
}

module.exports = {
    defaultConfigurations,
    userRoleTypes,
    userRoles,
    contactDetails,
};
