var express = require('express');
var router = express.Router();

const propertiesController = require('./controllers/propertiesController');

/* GET User Roles. */
router.get('/userroles', propertiesController.getUserRoles);

/* GET Departments. */
router.get('/departments', propertiesController.getDepartments);

module.exports = router;
