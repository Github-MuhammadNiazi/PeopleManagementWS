require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var routes = require('./routes/index');
var responseWrapper = require('./middlewares/responseWrapper');
var constants = require('./utils/constants');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Custom response wrapper middleware
app.use(responseWrapper);

app.use(`${constants.defaultConfigurations.apiPrefix}/${constants.defaultConfigurations.apiVersion}`, routes);

module.exports = app;
