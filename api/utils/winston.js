const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;
const path = require('path');
const constants = require('./constants');

// Generate log filename with current date
const logFilename = path.join(constants.defaultConfigurations.logsFilePath, `api_logs_${new Date().toISOString().split('T')[0].replace(/-/g, '_')}.log`);

const logFormat = printf(({ level,  message, timestamp, req}) => {
    const date = new Date(timestamp);
    const formattedTimestamp = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}.${String(date.getMilliseconds()).padStart(3, '0')}`;
    const format = [
        formattedTimestamp,
        level,
        ':',
        req ? `[${req.id}]` : null,
        message,
    ];
    return format.filter((item) => item).join(' ');
});

const consoleFormat = combine(
    colorize(),
    timestamp(),
    logFormat
);

const fileFormat = combine(
    timestamp(),
    logFormat
);

const winston = createLogger({
    transports: [
        new transports.Console({ format: consoleFormat }),
        new transports.File({ filename: logFilename, format: fileFormat })
    ]
});

module.exports = winston;
