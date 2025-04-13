var express = require('express');
var usersRouter = require('./usersRoute');
var employeesRouter = require('./employeesRoute');
var authRouter = require('./authRoute');
var propertiesRouter = require('./propertiesRoute');
var complaintsRouter = require('./complaintsRoute');
var authenticateToken = require('../middlewares/authMiddleware');

var router = express.Router();

router.use('/auth', authRouter);
router.use(authenticateToken);
router.use('/user', usersRouter);
router.use('/employees', employeesRouter)
router.use('/properties', propertiesRouter);
router.use('/complaints', complaintsRouter);

module.exports = router;
