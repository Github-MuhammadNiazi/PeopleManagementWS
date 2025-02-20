// This file is to be used only during development.
// It contains mock data that can be used to test the application.
// It is not to be used in production.

// REMOVE AFTER INTEGRATING WITH DATABASE

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

const mockData = {
    response,
};

module.exports = mockData;