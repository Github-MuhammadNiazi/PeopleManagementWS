/**
 * Function to generate create query
 * @param {string} query
 * @param {object} req
 * @returns {string}
 */
const GenerateCreateQuery = (query, req) => {
    const createdBy = req?.authorizedUser?.userId || 0;
    const updatedQuery = `${query.replace("{{CREATED_BY}}", createdBy)} RETURNING *`;
    return updatedQuery;
};

/**
 * Function to generate modify query
 * @param {string} query
 * @param {object} req
 * @returns {string}
 */
const GenerateModifyQuery = (query, req) => {
    const modifiedOn = getCurrentDateTime();
    const modifiedBy = req?.authorizedUser?.userId || 0;
    const updatedQuery = `${query}, "ModifiedOn" = '${modifiedOn}', "ModifiedBy" = ${modifiedBy} RETURNING *`;
    return updatedQuery;
};

module.exports = {
    GenerateCreateQuery,
    GenerateModifyQuery
};