const Joi = require('joi');
const constants = require('../utils/constants');

const getAllComplaintsSchema = Joi.object({
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

const createComplaintSchema = Joi.object({
    complaintType: Joi.string().required().valid(...Object.values(constants.complaints.Type)).messages({
        'any.required': 'Complaint type is required',
        'string.base': 'Complaint type must be a string',
        'any.only': 'Unknown complaint type',
    }),
    complaintDescription: Joi.string().required().messages({
        'any.required': 'Complaint description is required',
        'string.base': 'Complaint description must be a string',
    }),
    complaintDepartmentId: Joi.number().required().messages({
        'any.required': 'Complaint department id is required',
        'number.base': 'Complaint department id must be a number',
    }),
});

const getComplaintsByDepartmentIdSchema = Joi.object({
    id: Joi.number().required().messages({
        'any.required': 'Department ID is required',
        'number.base': 'Department ID must be a number',
    }),
});

module.exports = {
    createComplaintSchema,
    getComplaintsByDepartmentIdSchema,
    getAllComplaintsSchema,
};
