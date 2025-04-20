const Joi = require('joi');
const constants = require('../utils/constants');


const createComplaintSchema = Joi.object({
    complaintType: Joi.string().required().valid(...Object.values(constants.complaints.type)).messages({
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

const getAssignedComplaintsByEmployeeIdSchema = Joi.object({
    id: Joi.number().required().messages({
        'any.required': 'Employee ID is required',
        'number.base': 'Employee ID must be a number',
    }),
})

const getComplaintHistorySchema = Joi.object({
    id: Joi.number().required().messages({
        'any.required': 'Complaint ID is required',
        'number.base': 'Complaint ID must be a number',
    }),
});

const updateComplaintSchema = Joi.object({
    id: Joi.number().required().messages({
        'any.required': 'Complaint ID is required',
        'number.base': 'Complaint ID must be a number',
    }),
});

const updateComplaintBodySchema = Joi.object({
    complaintType: Joi.string().required().valid(...Object.values(constants.complaints.type)).messages({
        'string.base': 'Complaint type must be a string',
        'any.required': 'Complaint type is required',
    }),
    changeDescription: Joi.string().required().messages({
        'string.base': 'Change Description must be a string',
        'any.required': 'Change description is required',
    }),
    complaintDepartmentId: Joi.number().required().messages({
        'number.base': 'Complaint department id must be a number',
        'any.required': 'Complaint department id is required',
    }),
    currentStatus: Joi.string().required().valid(...Object.values(constants.complaints.status)).messages({
        'string.base': 'Current status must be a string',
        'any.required': 'Current status is required',
    }),
    resolution: Joi.string().optional().messages({
        'string.base': 'Resolution must be a string',
    }),
    needsApproval: Joi.boolean().optional().messages({
        'boolean.base': 'Needs approval must be a boolean',
    }),
});


module.exports = {
    createComplaintSchema,
    getComplaintsByDepartmentIdSchema,
    assignComplaintSchema,
    getAssignedComplaintsByEmployeeIdSchema,
    getComplaintHistorySchema,
    updateComplaintSchema,
    updateComplaintBodySchema,
};
