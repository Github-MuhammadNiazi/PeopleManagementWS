const defaultConfigurations = {
    apiPrefix: '/api',
    apiVersion: 'v1.0',
    defaultPort: 3000,
    dbSchema: 'public',
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
    userRoles,
};
