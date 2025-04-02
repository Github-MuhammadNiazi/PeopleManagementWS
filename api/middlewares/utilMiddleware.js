const constants = require('../utils/constants');

const paginationMiddleware = (req, res, next) => {
    const page = parseInt(req.query.page, 10) || constants.defaultConfigurations.pagination.page;
    const limit = parseInt(req.query.limit, 10) || constants.defaultConfigurations.pagination.limit;
    const maxLimit = constants.defaultConfigurations.pagination.maxLimit;

    req.pagination = {
        page,
        limit: limit > maxLimit ? maxLimit : limit,
        offset: (page - 1) * (limit > maxLimit ? maxLimit : limit),
    };
    next();
};

module.exports = {
    paginationMiddleware
};
