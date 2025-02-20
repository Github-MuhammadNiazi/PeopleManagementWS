var express = require('express');
var usersRouter = require('./users');
var authRouter = require('./auth');

var router = express.Router();

router.use('/user', usersRouter);
router.use('/auth', authRouter);

module.exports = router;