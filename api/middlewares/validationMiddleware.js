const validateRequestBody = (schema) => {
    return (req, res, next) => {
        if (!req.body) {
            return res.status(400).send({
                success: false,
                message: 'Request body is missing',
                data: null,
                error: null
            });
        }
        if (!schema) {
            return res.status(500).send({
                success: false,
                message: 'Schema is missing',
                data: null,
                error: null
            });
        }
        const { error } = schema.validate(req.body);
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

module.exports = {
    validateRequestBody,
    validatePathVariables
};
