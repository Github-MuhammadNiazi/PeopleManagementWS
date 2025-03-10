var express = require('express');
var router = express.Router();
var checkAccess = require('../middlewares/roleBasedAccessMiddleware');
var constants = require('../utils/constants');

const userController = require('./controllers/userController');

/* GET users listing. */
router.get('/', checkAccess(constants.userRoles.OperatingUser), userController.getAllUsers);

module.exports = router;
