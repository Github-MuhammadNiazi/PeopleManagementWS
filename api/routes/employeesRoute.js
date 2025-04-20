var express = require('express');
var router = express.Router();

const employeeController = require('./controllers/employeeController');
const allowAccess = require('../middlewares/roleBasedAccessMiddleware');
const constants = require('../utils/constants');
const { validateRequestBody, validateQueryParams } = require('../middlewares/validationMiddleware');
const validationSchema = require('../schemas/employeeSchemas');
const { paginationSchema } = require('../schemas/paginationSchemas');

/* GET employees listing. */
router.get('/',
    allowAccess([
        constants.userRoleTypes.Staff,
    ]),
    validateQueryParams(paginationSchema),
    validateQueryParams(validationSchema.getAllEmployeesSchema),
    employeeController.GetAllEmployees);

router.post('/',
    allowAccess([
        ...constants.userRoleTypes.Management
    ]),
    validateRequestBody(validationSchema.createEmployeeSchema),
    employeeController.CreateEmployee);

module.exports = router;
