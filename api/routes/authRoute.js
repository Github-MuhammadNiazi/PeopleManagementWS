var express = require('express');
var router = express.Router();

const authController = require('./controllers/authController');
const validateRequestBody = require('../middlewares/validateRequestBody')
const { loginSchema, signupSchema, generateResetCodeSchema, verifyResetCodeSchema, updatePasswordSchema } = require('../schemas/authSchemas');

/* GET Authentication. */
router.get('/', authController.AuthenticateConnection);

/* POST Login. */
router.post('/login', validateRequestBody(loginSchema), authController.Login);

/* POST Generate Reset Code. */
router.post('/password/reset', validateRequestBody(generateResetCodeSchema), authController.GenerateResetToken);

/* POST Verify Reset Code. */
router.post('/password/verify', validateRequestBody(verifyResetCodeSchema), authController.VerifyResetToken);

/* POST Reset Password. */
router.post('/password/update', validateRequestBody(updatePasswordSchema), authController.ResetPassword);

/* POST Signup. */
router.post('/signup', validateRequestBody(signupSchema), authController.Signup);

module.exports = router;
