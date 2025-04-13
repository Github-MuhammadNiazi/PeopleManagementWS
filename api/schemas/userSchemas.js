const Joi = require('joi');

const approveUserSchema = Joi.object({
  userId: Joi.number().required().messages({
    'any.required': 'User ID is required',
  }),
});

const suspendUserSchema = Joi.object({
  userId: Joi.number().required().messages({
    'any.required': 'User ID is required',
  }),
});

const deleteUserSchema = Joi.object({
  userId: Joi.number().required().messages({
    'any.required': 'User ID is required',
  }),
});

module.exports = {
  approveUserSchema,
  suspendUserSchema,
  deleteUserSchema,
};