// Load environment variables from .env file
require('dotenv').config();

// Import required modules
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var winston = require('./utils/winston');

// Import custom modules and routes
var routes = require('./routes/index');
var responseWrapper = require('./middlewares/responseWrapper');
var constants = require('./utils/constants');

// Initialize Express app
var app = express();

// Log all requests
app.use((req, res, next) => {
    winston.info(`${req.method} ${req.url}`);
    next();
});

// Use middleware for logging, parsing JSON and URL-encoded data, and handling cookies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Custom response wrapper middleware
app.use(responseWrapper);

// Use routes with API prefix and version
app.use(`${constants.defaultConfigurations.apiPrefix}/${constants.defaultConfigurations.apiVersion}`, routes);

module.exports = app;
