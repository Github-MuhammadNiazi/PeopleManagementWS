const validateRequestBody = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).send({
                success: false,
                message: error.details[0].message,
                data: null,
                error: error.details[0]
            });
        }
        next();
    };
};

module.exports = validateRequestBody;
