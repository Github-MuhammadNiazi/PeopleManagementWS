var express = require('express');
var router = express.Router();

const complaintController = require('./controllers/complaintController');
const allowAccess = require('../middlewares/roleBasedAccessMiddleware');
const constants = require('../utils/constants');
const { validateRequestBody, validatePathVariables, validateQueryParams } = require('../middlewares/validationMiddleware');
const validationSchema = require('../schemas/complaintSchemas');
const { paginationSchema } = require('../schemas/paginationSchemas');


/* GET complaints listing. */
router.get('/',
    allowAccess([
        ...constants.userRoleTypes.Management
    ]),
    validateQueryParams(paginationSchema),
    complaintController.GetAllComplaints);

/* GET complaints by departmentId. */
router.get('/department/:id(\\d+)',
    allowAccess([
        ...constants.userRoleTypes.Staff
    ]),
    validatePathVariables(validationSchema.getComplaintsByDepartmentIdSchema),
    validateQueryParams(paginationSchema),
    complaintController.GetComplaintsByDepartmentId);

/* POST create a new complaint */
router.post('/new',
    allowAccess([
        ...constants.userRoleTypes.Residents,
    ]),
    validateRequestBody(validationSchema.createComplaintSchema),
    complaintController.CreateComplaint);

/* GET complaint by user ID. */
router.get('/user',
    allowAccess([
        ...constants.userRoleTypes.Residents,
    ]),
    validateQueryParams(paginationSchema),
    complaintController.GetComplaintByUserId);

/* POST assign a complaint to a user. */
router.post('/assign',
    allowAccess([
        ...constants.userRoleTypes.Staff,
    ]),
    validateRequestBody(validationSchema.assignComplaintSchema),
    complaintController.AssignComplaint);

/* GET complaints assigned to an employee. */
router.get('/assigned/:id(\\d+)',
    allowAccess([
        ...constants.userRoleTypes.Staff
    ]),
    validatePathVariables(validationSchema.getAssignedComplaintsByEmployeeIdSchema),
    validateQueryParams(paginationSchema),
    complaintController.GetAssignedComplaintsByEmployeeId);

/* GET complaint history. */
router.get('/history',
    allowAccess([
        ...constants.userRoleTypes.All,
    ]),
    validateQueryParams(validationSchema.getComplaintHistorySchema),
    complaintController.GetComplaintHistory);

router.post('/update/:id(\\d+)',
    allowAccess([
        ...constants.userRoleTypes.Staff,
    ]),
    validatePathVariables(validationSchema.updateComplaintSchema),
    validateRequestBody(validationSchema.updateComplaintBodySchema),
    complaintController.UpdateComplaint);

module.exports = router;
