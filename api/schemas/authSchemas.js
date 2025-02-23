const Joi = require('joi');

const loginSchema = Joi.object({
    username: Joi.alternatives().try(Joi.string().email(), Joi.string().pattern(/^[0-9]+$/)).required(),
    password: Joi.string().required()
});

module.exports = {
    loginSchema
};