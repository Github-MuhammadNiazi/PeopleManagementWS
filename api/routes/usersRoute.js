var express = require('express');
var router = express.Router();
var allowAccess = require('../middlewares/roleBasedAccessMiddleware');
var constants = require('../utils/constants');

const userController = require('./controllers/userController');

/* GET users listing. */
router.get('/',
    allowAccess([
        ...constants.userRoleTypes.Staff
    ]),
    userController.getAllUsers);

module.exports = router;
