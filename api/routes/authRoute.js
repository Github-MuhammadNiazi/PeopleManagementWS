var express = require('express');
var router = express.Router();

const authController = require('./controllers/authController');
const validateRequestBody = require('../middlewares/validateRequestBody')
const authMiddleware = require('../middlewares/authMiddleware');
const validationSchema = require('../schemas/authSchemas');

/* GET Authentication. */
router.get('/',
    authController.AuthenticateConnection
);

/* POST Login. */
router.post('/login',
    validateRequestBody(validationSchema.loginSchema),
    authController.Login
);

/* POST Generate Reset Code. */
router.post('/password/reset',
    validateRequestBody(validationSchema.generateResetCodeSchema),
    authController.GenerateResetToken
);

/* POST Verify Reset Code. */
router.post('/password/verify',
    authMiddleware,
    validateRequestBody(validationSchema.verifyResetCodeSchema),
    authController.VerifyResetToken
);

/* POST Reset Password. */
router.post('/password/update',
    authMiddleware,
    validateRequestBody(validationSchema.updatePasswordSchema),
    authController.ResetPassword
);

/* POST Signup. */
router.post('/signup',
    validateRequestBody(validationSchema.signupSchema),
    authController.Signup
);

module.exports = router;
