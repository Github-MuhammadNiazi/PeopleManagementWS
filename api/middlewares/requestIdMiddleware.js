const { v4: uuidv4 } = require('uuid');

const requestUuid = (req, res, next) => {
  req.id = uuidv4();
  next();
};

module.exports = requestUuid;
