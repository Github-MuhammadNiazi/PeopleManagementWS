var express = require('express');
var router = express.Router();

const authController = require('./controllers/authController');
const validateRequestBody = require('../middlewares/validateRequestBody')
const { loginSchema } = require('../schemas/authSchemas');

/* GET Authentication. */
router.get('/', authController.authenticateConnection);

/* POST Login. */
router.post('/login', validateRequestBody(loginSchema), authController.login);

module.exports = router;
