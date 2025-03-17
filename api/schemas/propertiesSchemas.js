const Joi = require('joi');

const createDepartmentSchema = Joi.object({
    departmentName: Joi.string().required(),
    description: Joi.string().required()
});

module.exports = {
    createDepartmentSchema
};
