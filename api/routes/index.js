var express = require('express');
var usersRouter = require('./usersRoute');
var authRouter = require('./authRoute');
var propertiesRouter = require('./propertiesRoute');

var router = express.Router();

router.use('/user', usersRouter);
router.use('/auth', authRouter);
router.use('/properties', propertiesRouter);

module.exports = router;