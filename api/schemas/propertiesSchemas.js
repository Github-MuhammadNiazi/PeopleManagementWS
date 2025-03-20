const Joi = require('joi');

const createDepartmentSchema = Joi.object({
    departmentName: Joi.string().required(),
    description: Joi.string().required()
});

const createEmployeeRoleSchema = Joi.object({
    roleName: Joi.string().required(),
    roleDescription: Joi.string().required(),
    departmentId: Joi.number().required(),
});

module.exports = {
    createDepartmentSchema,
    createEmployeeRoleSchema,
};
