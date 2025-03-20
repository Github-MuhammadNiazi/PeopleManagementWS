var express = require('express');
var router = express.Router();

const propertiesController = require('./controllers/propertiesController');
var allowAccess = require('../middlewares/roleBasedAccessMiddleware');
var constants = require('../utils/constants');
var validateRequestBody = require('../middlewares/validateRequestBodyMiddleware');
var validationSchema = require('../schemas/propertiesSchemas');

/* GET User Roles. */
router.get('/userroles',
    allowAccess([
        ...constants.userRoleTypes.Management
    ]),
    propertiesController.getUserRoles);

/* GET Departments. */
router.get('/departments',
    propertiesController.getDepartments);

/* POST Departments. */
router.post('/departments',
    allowAccess([
        ...constants.userRoleTypes.Management
    ]),
    validateRequestBody(validationSchema.createDepartmentSchema),
    propertiesController.createDepartment);

/* GET Employee Roles. */
router.get('/employeeroles',
    propertiesController.getEmployeeRoles);

/* POST Employee Roles. */
router.post('/employeerole',
    allowAccess([
        ...constants.userRoleTypes.Management
    ]),
    validateRequestBody(validationSchema.createEmployeeRoleSchema),
    propertiesController.createEmployeeRole);

module.exports = router;
