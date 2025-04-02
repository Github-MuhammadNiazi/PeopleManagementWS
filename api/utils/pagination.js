const constants = require('./constants');

/**
 * Paginates the request based on provided query parameters.
 * @param {Object} query - Query object containing limit and page as properties.
 * @returns {Object} - An object containing limit, offset and page properties.
 * @description
 * The default values for limit and page are set in the constants file.
 * The function takes the values from the query object and verifies if they are
 * valid numbers. If not, the default values are used. The limit is also
 * capped at the maxLimit set in the constants file. The offset is calculated
 * using the page and limit values.
 */
function paginate(query) {
    const inboundLimit = parseInt(query.limit, 10) || constants.defaultConfigurations.pagination.limit;
    const page = parseInt(query.page, 10) || constants.defaultConfigurations.pagination.page;
    const limit = inboundLimit > constants.defaultConfigurations.pagination.maxLimit
        ? constants.defaultConfigurations.pagination.maxLimit
        : inboundLimit;
    const offset = (page - 1) * limit;

    return { limit, offset, page };
}

module.exports = paginate;