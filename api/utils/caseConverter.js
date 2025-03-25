const _ = require('lodash');

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

module.exports = { toCamelCase };
