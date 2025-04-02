var express = require('express');
var router = express.Router();

const userController = require('./controllers/userController');
const allowAccess = require('../middlewares/roleBasedAccessMiddleware');
const constants = require('../utils/constants');
const { validateRequestBody, validateQueryParams } = require('../middlewares/validationMiddleware');
const validationSchema = require('../schemas/userSchemas');
const { paginationSchema } = require('../schemas/paginationSchemas');

/* GET users listing. */
router.get('/',
    allowAccess([
        ...constants.userRoleTypes.Staff
    ]),
    validateQueryParams(paginationSchema),
    userController.GetAllUsers);

/* GET users pending approval */
router.get('/pending',
    allowAccess([
        ...constants.userRoleTypes.Management
    ]),
    validateQueryParams(paginationSchema),
    userController.GetUsersPendingApproval);

/* POST Update User status to Approved */
router.post('/approve',
    allowAccess([
        ...constants.userRoleTypes.Management
    ]),
    validateRequestBody(validationSchema.approveUserSchema),
    userController.ApproveUser);

/* GET suspended users */
router.get('/suspended',
    allowAccess([
        ...constants.userRoleTypes.Management
    ]),
    validateQueryParams(paginationSchema),
    userController.GetSuspendedUsers);

/* POST Update User status to Suspended */
router.post('/suspend',
    allowAccess([
        ...constants.userRoleTypes.Management
    ]),
    validateRequestBody(validationSchema.suspendUserSchema),
    userController.SuspendUser);

/* GET deleted users */
router.get('/deleted',
    allowAccess([
        ...constants.userRoleTypes.Management
    ]),
    userController.GetDeletedUsers);

/* DELETE Update User status to Delete */
router.delete('/delete',
    allowAccess([
        ...constants.userRoleTypes.Management
    ]),
    validateRequestBody(validationSchema.deleteUserSchema),
    userController.DeleteUser);

router.post('/employee',
    allowAccess([
        ...constants.userRoleTypes.Management
    ]),
    validateRequestBody(validationSchema.createEmployeeSchema),
    userController.CreateEmployee);

module.exports = router;
