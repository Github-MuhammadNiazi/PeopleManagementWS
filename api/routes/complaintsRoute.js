var express = require('express');
var router = express.Router();

const complaintController = require('./controllers/complaintController');
var allowAccess = require('../middlewares/roleBasedAccessMiddleware');
var constants = require('../utils/constants');
var validateRequestBody = require('../middlewares/validateRequestBodyMiddleware');

/* GET complaints listing. */
router.get('/',
    allowAccess([
        ...constants.userRoleTypes.Staff
    ]),
    complaintController.GetAllComplaints);

module.exports = router;
