const Joi = require('joi');

const loginSchema = Joi.object({
    username: Joi.alternatives().try(Joi.string().email(), Joi.string().pattern(/^[0-9]+$/)).required(),
    password: Joi.string().required()
});

const signupSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    identificationNumber: Joi.string().required(),
    password: Joi.string().min(8).required(),
    userRoleId: Joi.number().required(),
    contactNumber: Joi.string().required(),
    email: Joi.string().email().required(),
    isAppartment: Joi.boolean().optional(),
    appartment: Joi.string().
        when('isAppartment', { is: true, then: Joi.required() }),
    building: Joi.string().
        when('isAppartment', { is: false, then: Joi.required() }),
    street: Joi.string().required(),
    region: Joi.string().required(),
    city: Joi.string().required(),
    country: Joi.string().required(),
    isForeigner: Joi.boolean().required(),
});

module.exports = {
    loginSchema,
    signupSchema
};
