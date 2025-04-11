const Joi = require('joi');
const constants = require('../utils/constants');

const paginationSchema = Joi.object({
    page: Joi.number().integer().min(1).messages({
        'number.base': 'Page must be a number',
        'number.integer': 'Page must be an integer',
        'number.min': 'Page must be at least 1',
    }),
    stepCount: Joi.number().integer().min(1).max(constants.defaultConfigurations.pagination.maxStepCount).messages({
        'number.base': 'StepCount must be a number',
        'number.integer': 'StepCount must be an integer',
        'number.min': 'StepCount must be at least 1',
        'number.max': `StepCount must be at most ${constants.defaultConfigurations.pagination.maxStepCount}`,
    }),
});

module.exports = { paginationSchema };
