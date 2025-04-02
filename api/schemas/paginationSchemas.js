const Joi = require('joi');
const constants = require('../utils/constants');

const paginationSchema = Joi.object({
    page: Joi.number().integer().min(1).messages({
        'number.base': 'Page must be a number',
        'number.integer': 'Page must be an integer',
        'number.min': 'Page must be at least 1',
    }),
    limit: Joi.number().integer().min(1).max(constants.defaultConfigurations.pagination.maxLimit).messages({
        'number.base': 'Limit must be a number',
        'number.integer': 'Limit must be an integer',
        'number.min': 'Limit must be at least 1',
        'number.max': `Limit must be at most ${constants.defaultConfigurations.pagination.maxLimit}`,
    }),
});

module.exports = { paginationSchema };
