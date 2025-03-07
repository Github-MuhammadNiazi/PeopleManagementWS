// This file is to be used only during development.
// It contains mock data that can be used to test the application.
// It is not to be used in production.

// REMOVE AFTER INTEGRATING WITH DATABASE

const mockLogin = {
    username: 'admin@admin.com',
    password: 'admin'
};
const response = {
    user: {
        getUsers: [
            {
                id: 1,
                name: 'John Doe',
                email: 'johndoe@test.com',
                role: 'admin',
            },
            {
                id: 2,
                name: 'Jane Doe',
                email: 'janedoe@test.com',
                role: 'user',
            }
        ],
    }
};

// Mock Methods
const verifyLogin = (requestObject) => {
    const { username, password } = requestObject.body;
    return username === mockLogin.username && password === mockLogin.password;
};

const mockData = {
    response,
    mockLogin,
    verifyLogin
};

module.exports = mockData;
