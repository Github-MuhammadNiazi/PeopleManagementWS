const defaultConfigurations = {
    // Make sure to use 'dev', 'test' or 'prod' for environments
    environment: 'dev',
    appName: 'People Management WS',
    appNameShort: 'PMWS', // Short name for Services
    apiPrefix: '/api',
    apiVersion: 'v1.0',
    defaultPort: 3000,
    dbSchema: 'public',
    logsFilePath: 'logs',
    tokenExpiry: {
        accessToken: '2h',
        passwordResetToken: '1h',
    },
    pagination: {
        page: 1,
        stepCount: 10,
        maxStepCount: 100,
    },
    allowedPlatforms: [
        'web',
        'android',
        'ios',
        // Uncomment for local testing only
        // 'debug',
    ],
    allowedDateFormats: {
        apiDateTimeFormat: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
        reqestDatetimeFormat: 'YYYY-MM-DD HH:mm:ss',
        requestDateFormat: 'YYYY-MM-DD',
        requestTimeFormat: 'HH:mm:ss',
    },
    // Make sure that these emails are verified with Brevo
    systemVerifiedEmails: {
        dev: {
            support: 'support@app.com',
        },
    },
    systemVerifiedUrls: {
        dev: {
            images: {
                appLogo: 'https://cdn-icons-png.flaticon.com/512/2161/2161475.png',
            }
        },
    },
}

const contactDetails = {
    emails: {
        support: 'support@support.com'
    },
    phoneNumbers: {
        support: '+1234567890'
    },
}

const userRoles = {
    Admin: 1,
    ManagementUser: 2,
    OperatingUser: 3,
    ResidentUser: 4,
    RegisteredUser: 5,
    UnregisteredUser: 6,
}

const userRoleTypes = {
    All: [userRoles.Admin, userRoles.ManagementUser, userRoles.OperatingUser, userRoles.ResidentUser, userRoles.RegisteredUser, userRoles.UnregisteredUser],
    Admin: [userRoles.Admin],
    Management: [userRoles.ManagementUser],
    Staff: [userRoles.OperatingUser, userRoles.ManagementUser],
    Residents: [userRoles.ResidentUser],
}

const complaints = {
    status: {
        pending: 'Pending',
        inProgress: 'In Progress',
        needsApproval: 'Needs Approval',
        approved: 'Approved',
        needsReview: 'Needs Review',
        resolved: 'Resolved',
        closed: 'Closed',
    },
    type: {
        complaint: 'Complaint',
        suggestion: 'Suggestion',
        inquiry: 'Inquiry',
        feedback: 'Feedback',
        urgent: 'Urgent',
        horticultural: 'Horticultural',
        other: 'Other',
    }
}

module.exports = {
    defaultConfigurations,
    userRoleTypes,
    userRoles,
    contactDetails,
    complaints,
};
