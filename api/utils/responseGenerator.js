function generateResponseBody(data, message = '', error = null) {
    return {
        data: data,
        message: message,
        error: error,
    };
}

module.exports = generateResponseBody;
