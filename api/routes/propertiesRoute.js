var express = require('express');
var router = express.Router();

const propertiesController = require('./controllers/propertiesController');

/* GET User Roles. */
router.get('/userroles', propertiesController.getUserRoles);

module.exports = router;
