const Joi = require('joi');
const constants = require('../utils/constants');


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

const assignComplaintSchema = Joi.object({
    userId: Joi.number().required().messages({
        'any.required': 'User ID is required',
        'number.base': 'User ID must be a number',
    }),
    complaintId: Joi.number().required().messages({
        'any.required': 'Complaint ID is required',
        'number.base': 'Complaint ID must be a number',
    }),
});

module.exports = {
    createComplaintSchema,
    getComplaintsByDepartmentIdSchema,
    assignComplaintSchema,
};
