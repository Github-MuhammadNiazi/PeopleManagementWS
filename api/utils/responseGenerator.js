function generateResponseBody(data, message = '', error = null) {
    return {
        data: data,
        message: message,
        error: error
            ? typeof error === 'string'
                ? error.replace(/["]/g, '')
                : Object.fromEntries(Object.entries(error).map(([key, value]) => {
                    if (typeof value === 'string') {
                        return [key, value.replace(/["]/g, '')];
                    } else if (typeof value === 'object') {
                        return [key, value];
                    } else {
                        return [key, value.toString()];
                    }
                }))
            : null,
    };
}

module.exports = generateResponseBody;
