const _ = require('lodash');
const winston = require('./winston');

const postgresErrorMessages = new Map([
    ['00000', 'Successful Completion'],
    ['01000', 'Warning'],
    ['02000', 'No Data'],
    ['23502', 'Not null violation'],
    ['23503', 'Foreign key violation'],
    ['23505', 'Unique constraint violation'],
    ['23514', 'Check constraint violation'],
    ['22001', 'String data right truncation'],
    ['22003', 'Numeric value out of range'],
    ['22007', 'Invalid datetime format'],
    ['22012', 'Division by zero'],
    ['42601', 'Syntax error'],
    ['42703', 'Undefined column'],
    ['42P01', 'Undefined table'],
    ['42883', 'Undefined function'],
    ['42804', 'Datatype mismatch'],
    ['40001', 'Serialization failure'],
    ['40P01', 'Deadlock detected'],
    ['55006', 'Object in use'],
    ['57014', 'Query canceled'],
    ['57P03', 'Cannot connect now'],
    ['F0000', 'Configuration file error'],
    ['P0001', 'Raise exception'],
    ['XX000', 'Internal error'],
    ['08003', 'Connection does not exist'],
    ['08006', 'Connection failure'],
    ['0A000', 'Feature not supported'],
    ['28P01', 'Invalid password'],
]);

function toCamelCase(obj) {
    if (Array.isArray(obj)) {
        return obj.map(toCamelCase);
    } else if (obj && typeof obj === 'object' && !(obj instanceof Date)) {
        return Object.keys(obj).reduce((acc, key) => {
            const camelKey = _.camelCase(key);
            acc[camelKey] = toCamelCase(obj[key]);
            return acc;
        }, {});
    }
    return obj; // Return primitive values (string, number, boolean, date, etc.) as-is
}

function getErrorCode(error, req) {
    if (error && (error.status || error.code)) {
        const errorCode = error.status || error.code;
        if (errorCode >= 400 && errorCode <= 500) {
            winston.error('Client error', { req });
            return errorCode;
        } else if (errorCode === 'ECONNREFUSED') {
            winston.error('Connection refused', { req });
            return 503; // Service Unavailable
        } else if (errorCode === 'ETIMEDOUT') {
            winston.error('Connection timed out', { req });
            return 504; // Gateway Timeout
        } else if (errorCode >= 500 && errorCode <= 599) {
            winston.error('Server error', { req });
            return errorCode;
        } else if (errorCode === 'ENOTFOUND') {
            winston.error('Service not found', { req });
            return 404; // Not Found
        } else if (errorCode === 'ECONNRESET') {
            winston.error('Connection reset', { req });
            return 502; // Bad Gateway
        } else if (errorCode === 'ECONNABORTED') {
            winston.error('Connection aborted', { req });
            return 502; // Bad Gateway
        } else if (errorCode === 'EAI_FAIL') {
            winston.error('Connection failed', { req });
            return 502; // Bad Gateway
        } else if (errorCode === 'EAI_SYSTEM') {
            winston.error('System error', { req });
            return 502; // Bad Gateway
        } else if (errorCode === 'EAI_AGAIN') {
            winston.error('Connection again', { req });
            return 502; // Bad Gateway
        } else if (errorCode === 'EAI_NONAME') {
            winston.error('Noname error', { req });
            return 502; // Bad Gateway
        } else if (errorCode === 'EAI_NODATA') {
            winston.error('No data error', { req });
            return 502; // Bad Gateway
        } else {
            winston.error(`Unknown error: ${errorCode}`, { req });
            return 500; // Internal Server Error
        }
    }
    winston.error(`Error code not found: ${error}`, { req });
    return 500;
}

function getPostgresErrorCodeMessage(error, req) {
    if (error && (error.status || error.code)) {
        const errorCode = error.status || error.code;
        const message = postgresErrorMessages.get(errorCode);
        if (message) {
            winston.error(`${message}`, { req });
            return message;
        } else {
            winston.error(`Unknown PostgreSQL error code: ${errorCode}`, { req });
            return "Unknown PostgreSQL error";
        }
    }
    winston.error(`Error code not found or malformed error object: ${JSON.stringify(error)}`, { req });
    return "Unknown error";
}

module.exports = {
    toCamelCase,
    getErrorCode,
    getPostgresErrorCodeMessage,
};
