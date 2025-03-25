var express = require('express');
var router = express.Router();

const complaintController = require('./controllers/complaintController');
var allowAccess = require('../middlewares/roleBasedAccessMiddleware');
var constants = require('../utils/constants');
var validateRequestBody = require('../middlewares/validateRequestBodyMiddleware');
var validationSchema = require('../schemas/complaintSchemas');

/* GET complaints listing. */
router.get('/',
    allowAccess([
        ...constants.userRoleTypes.Staff
    ]),
    complaintController.GetAllComplaints);

/* POST create a new complaint */
router.post('/new',
    allowAccess([
        constants.userRoles.RegisteredUser,
        constants.userRoles.Admin,
    ]),
    validateRequestBody(validationSchema.createComplaintSchema),
    complaintController.CreateComplaint);

module.exports = router;
