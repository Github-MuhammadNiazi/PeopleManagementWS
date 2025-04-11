const constants = require('../utils/constants');

const paginationMiddleware = (req, res, next) => {
    const page = parseInt(req.query.page, 10) || constants.defaultConfigurations.pagination.page;
    const stepCount = parseInt(req.query.stepCount, 10) || constants.defaultConfigurations.pagination.stepCount;
    const maxStepCount = constants.defaultConfigurations.pagination.maxStepCount;

    req.pagination = {
        page,
        stepCount: stepCount > maxStepCount ? maxStepCount : stepCount,
        offset: (page - 1) * (stepCount > maxStepCount ? maxStepCount : stepCount),
    };
    next();
};

module.exports = {
    paginationMiddleware
};
