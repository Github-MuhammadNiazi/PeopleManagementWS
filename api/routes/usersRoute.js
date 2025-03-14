var express = require('express');
var router = express.Router();

const userController = require('./controllers/userController');
var allowAccess = require('../middlewares/roleBasedAccessMiddleware');
var constants = require('../utils/constants');
var validateRequestBody = require('../middlewares/validateRequestBodyMiddleware');
var validationSchema = require('../schemas/userSchemas');

/* GET users listing. */
router.get('/',
    allowAccess([
        ...constants.userRoleTypes.Staff
    ]),
    userController.GetAllUsers);

/* POST Update User status to Approved */
router.post('/approve',
    allowAccess([
        ...constants.userRoleTypes.Management
    ]),
    validateRequestBody(validationSchema.approveUserSchema),
    userController.ApproveUser);

/* POST Update User status to Suspended */
router.post('/suspend',
    allowAccess([
        ...constants.userRoleTypes.Management
    ]),
    validateRequestBody(validationSchema.suspendUserSchema),
    userController.SuspendUser);

/* DELETE Update User status to Delete */
router.delete('/delete',
    allowAccess([
        ...constants.userRoleTypes.Management
    ]),
    validateRequestBody(validationSchema.deleteUserSchema),
    userController.DeleteUser);

module.exports = router;
