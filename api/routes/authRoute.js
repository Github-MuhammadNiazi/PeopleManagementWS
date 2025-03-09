var express = require('express');
var router = express.Router();

const authController = require('./controllers/authController');
const validateRequestBody = require('../middlewares/validateRequestBody')
const { loginSchema, signupSchema } = require('../schemas/authSchemas');

/* GET Authentication. */
router.get('/', authController.AuthenticateConnection);

/* POST Login. */
router.post('/login', validateRequestBody(loginSchema), authController.Login);

/* POST Signup. */
router.post('/signup', validateRequestBody(signupSchema), authController.Signup);

module.exports = router;
