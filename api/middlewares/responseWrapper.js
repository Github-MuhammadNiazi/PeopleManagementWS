function responseWrapper(req, res, next) {
    const originalSend = res.send;

    res.send = function (body) {
        // Ensure the body is a valid JSON object
        let responseBody = {};
        try {
            if (typeof body === 'string') {
                responseBody = JSON.parse(body);
            } else {
                responseBody = JSON.parse(JSON.stringify(body));
            }
        } catch (error) {
            responseBody.data = body;
            responseBody.message = 'Unable to parse response body';
            responseBody.error = error.message;
            res.statusCode = 500;
        }

        // Check if the body is already wrapped to prevent recursive wrapping
        if (responseBody && responseBody.success !== undefined && responseBody.data !== undefined && responseBody.error !== undefined) {
            return originalSend.call(this, body);
        }
        const response = {
            success: res.statusCode < 400,
            message: body.message || '',
            data: responseBody.data || null,
            error: responseBody.error || null,
        };
        originalSend.call(this, response);
    };

    next();
}

module.exports = responseWrapper;
