const Joi = require('joi');

const approveUserSchema = Joi.object({
  userId: Joi.string().required().messages({
    'any.required': 'User ID is required',
  }),
});

suspendUserSchema = Joi.object({
  userId: Joi.string().required().messages({
    'any.required': 'User ID is required',
  }),
});

deleteUserSchema = Joi.object({
  userId: Joi.string().required().messages({
    'any.required': 'User ID is required',
  }),
});

module.exports = {
  approveUserSchema,
  suspendUserSchema,
  deleteUserSchema,
};