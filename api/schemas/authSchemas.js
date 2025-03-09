const Joi = require('joi');

const loginSchema = Joi.object({
    username: Joi.string().required().messages({
        'any.required': 'Username is required',
    }),
    password: Joi.string().required().messages({
        'any.required': 'Password is required'
    })
});

const signupSchema = Joi.object({
    firstName: Joi.string().required().messages({
        'any.required': 'First name is required'
    }),
    lastName: Joi.string().required().messages({
        'any.required': 'Last name is required'
    }),
    identificationNumber: Joi.string().required().messages({
        'any.required': 'Identification number is required'
    }),
    password: Joi.string().min(8).required().messages({
        'string.min': 'Password must be at least 8 characters long',
        'any.required': 'Password is required'
    }),
    userRoleId: Joi.number().required().messages({
        'any.required': 'User role ID is required'
    }),
    contactNumber: Joi.string().required().messages({
        'any.required': 'Contact number is required'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Email must be a valid email address',
        'any.required': 'Email is required'
    }),
    isApartment: Joi.alternatives().try(Joi.boolean(), Joi.allow(null)).optional(),
    apartment: Joi.alternatives().try(Joi.string(), Joi.allow(null))
        .when('isApartment', { is: true, then: Joi.required() }).messages({
            'any.required': 'Apartment is required when isApartment is true'
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
    isForeigner: Joi.boolean().required().messages({
        'any.required': 'IsForeigner is required'
    }),
});

module.exports = {
    loginSchema,
    signupSchema
};
