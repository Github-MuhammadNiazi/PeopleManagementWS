// Load environment variables from .env file
require('dotenv').config();

// Import required modules
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var winston = require('./utils/winston');

// Import custom modules and routes
var routes = require('./routes/index');
var responseWrapper = require('./middlewares/responseWrapperMiddleware');
var requestUuid = require('./middlewares/requestIdMiddleware');
var constants = require('./utils/constants');

// Initialize Express app
var app = express();

// Use middleware for logging, parsing JSON and URL-encoded data, and handling cookies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to check if the request is coming from an allowed platform
app.use((req, res, next) => {
    if (!req.headers['platform'] || constants.defaultConfigurations.allowedPlatforms.indexOf(req.headers['platform']) === -1) {
        return res.status(400).json({ error: 'Unregistered access.' });
    }
    next();
});

// Custom response wrapper middleware
app.use(responseWrapper);

// Add request ID to each request
app.use(requestUuid);

// Log all requests
app.use((req, res, next) => {
    let logMessage = `${req.method} ${req.url}`;
    logMessage = req?.headers['platform'] ? `[platform: ${req?.headers['platform']}] ` + logMessage : logMessage;
    winston.info(logMessage, { req });

    // Redact passwords from request data
    const redactPasswords = (obj) => {
        if (obj && typeof obj === 'object') {
            for (const key in obj) {
                if (key.toLowerCase().includes('password')) {
                    obj[key] = '********';
                } else if (typeof obj[key] === 'object') {
                    redactPasswords(obj[key]);
                }
            }
        }
    };

    const redactedReqBody = req.body ? { ...req.body } : req.body;
    redactPasswords(redactedReqBody);

    requsetDataMessage = [
        req.body && Object.keys(req.body).length > 0 ? `req: ${JSON.stringify(redactedReqBody)}` : null,
        req.query && Object.keys(req.query).length > 0 ? `query: ${JSON.stringify(req.query)}` : null,
        req.params && Object.keys(req.params).length > 0 ? `params: ${JSON.stringify(req.params)}` : null,
    ].filter((item) => item).join(', ');
    if (requsetDataMessage) {
        winston.info(requsetDataMessage, { req });
    }
    next();
});

// Use routes with API prefix and version
app.use(`${constants.defaultConfigurations.apiPrefix}/${constants.defaultConfigurations.apiVersion}`, routes);

module.exports = app;
