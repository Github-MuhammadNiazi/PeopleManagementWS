const winston = require('../utils/winston');

const validateRequestBody = (schema) => {
    return (req, res, next) => {
        if (!req.body) {
            winston.error('Request body is missing', { req });
            return res.status(400).send({
                success: false,
                message: 'Request body is missing',
                data: null,
                error: null
            });
        }
        if (!schema) {
            winston.error('Schema is missing', { req });
            return res.status(500).send({
                success: false,
                message: 'Schema is missing',
                data: null,
                error: null
            });
        }
        const { error } = schema.validate(req.body);
        if (error) {
            winston.error(`Validation error: ${error.details[0].message}`, { req });
            return res.status(400).send({
                success: false,
                message: error.details[0].message.replace(/['"]/g, ''),
                data: null,
                error: error.details[0].path
            });
        }
        next();
    };
};

const validatePathVariables = (schema) => {
    return (req, res, next) => {
        if (!schema) {
            return res.status(500).send({
                success: false,
                message: 'Schema is missing',
                data: null,
                error: null
            });
        }
        const { error } = schema.validate(req.params);
        if (error) {
            return res.status(400).send({
                success: false,
                message: error.details[0].message.replace(/['"]/g, ''),
                data: null,
                error: error.details[0].path
            });
        }
        next();
    };
};

const validateQueryParams = (schema) => {
    return (req, res, next) => {
        if (!schema) {
            return res.status(500).send({
                success: false,
                message: 'Schema is missing',
                data: null,
                error: null
            });
        }
        const { error } = schema.validate(req.query, { abortEarly: false, allowUnknown: true });
        if (error) {
            return res.status(400).send({
                success: false,
                message: error.details[0].message.replace(/['"]/g, ''),
                data: null,
                error: error.details[0].path
            });
        }
        next();
    };
};

module.exports = {
    validateRequestBody,
    validatePathVariables,
    validateQueryParams
};
