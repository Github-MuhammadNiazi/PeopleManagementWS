const validateRequestBody = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).send({
                success: false,
                message: 'Invalid request body',
                data: null,
                error: error.details[0].message
            });
        }
        next();
    };
};

module.exports = validateRequestBody;
