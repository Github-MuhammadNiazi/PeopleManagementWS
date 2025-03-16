const moment = require('moment');
const constants = require('./constants');

module.exports = {
    formatDate: function(date, format = constants.defaultConfigurations.allowedDateFormats.apiDateTimeFormat) {
        return moment(date, format).toDate();
    },
    getCurrentDateTime: function(format = constants.defaultConfigurations.allowedDateFormats.apiDateTimeFormat) {
        return moment().format(format);
    },
};