const Joi = require('joi');
const constants = require('../utils/constants');

const createEmployeeSchema = Joi.object({
    firstName: Joi.string().required().messages({
        'any.required': 'First name is required'
    }),
    lastName: Joi.string().required().messages({
        'any.required': 'Last name is required'
    }),
    identificationNumber: Joi.string().required().messages({
        'any.required': 'Identification number is required'
    }),
    userRoleId: Joi.number().required().integer()
        .min(constants.userRoles.Admin).
        max(constants.userRoles.OperatingUser)
        .messages({
            'any.required': 'User role ID is required',
            'number.base': 'User role ID must be a number',
            'number.min': 'Invalid User Role ID',
            'number.max': 'Invalid User Role ID',
        }),
    employeeRoleId: Joi.number().required().messages({
        'any.required': 'Employee role ID is required'
    }),
    contactNumber: Joi.string().required().messages({
        'any.required': 'Contact number is required'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Email must be a valid email address',
        'any.required': 'Email is required'
    }),
    building: Joi.alternatives().try(Joi.string()).optional()
        .when('isApartment', { is: false, then: Joi.required() }).messages({
            'any.required': 'Building is required when isApartment is false'
        }),
    street: Joi.alternatives().try(Joi.string()).optional()
        .when('building', { not: null, then: Joi.required() }).messages({
            'any.required': 'Street is required when building'
        }),
    region: Joi.alternatives().try(Joi.string()).optional()
        .when('street', { not: null, then: Joi.required() }).messages({
            'any.required': 'Region is required when street is provided'
        }),
    city: Joi.alternatives().try(Joi.string()).optional()
        .when('region', { not: null, then: Joi.required() }).messages({
            'any.required': 'City is required when region is provided'
        }),
    country: Joi.alternatives().try(Joi.string()).optional()
        .when('city', { not: null, then: Joi.required() }).messages({
            'any.required': 'Country is required when city is provided'
        }),
});

const getAllEmployeesSchema = Joi.object({
    isManager: Joi.boolean().optional(),
    departmentId: Joi.number().optional().messages({
        'number.base': 'Department ID must be a number'
    }),
});

module.exports = {
    createEmployeeSchema,
    getAllEmployeesSchema,
};
