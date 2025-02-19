var express = require('express');
const generateResponseBody = require('../utils/responseGenerator');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(generateResponseBody({
    users: [
      {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@test.com',
        role: 'admin',
      },
      {
        id: 2,
        name: 'Jane Doe',
        email: 'janedoe@test.com',
        role: 'user',
      }
    ]
  }, 'Users retrieved successfully'));
});

module.exports = router;
