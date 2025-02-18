var express = require('express');
var router = express.Router();

/* GET connection status. */
router.get('/', function(req, res, next) {
  res.send('Connection Authenticated');
});

module.exports = router;
