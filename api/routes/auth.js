var express = require('express');
var router = express.Router();

const authController = require('./controllers/authController');

/* GET Authentication. */
router.get('/', authController.authenticateConnection);

module.exports = router;
