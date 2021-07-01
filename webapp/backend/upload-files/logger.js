const winston = require("winston");
const { format, loggers, transports, prettyPrint } = require("winston");
require('winston-daily-rotate-file');

const timezoned = () => {
    return new Date().toLocaleString('en-US', {
        timeZone: 'America/New_York'
    });
}

var filetransport = new (winston.transports.DailyRotateFile)({
    filename: "logs/uploadfiles-%DATE%-all.log",
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchived: true,
    maxSize: '10m',
    maxFiles: '1000',
    format: format.combine(format.timestamp({ format: timezoned }), format.prettyPrint()),
    level: "info"
});

filetransport.on('rotate', function (oldFileName, newFileName) { });

if (process.env.NODE_ENV !== "production") {
    loggers.add("uploadfileslogger", {
        transports: [
            new transports.Console()
        ]
    });
} else {
    loggers.add("uploadfileslogger", {
        transports: [
            filetransport
        ]
    });
}

const logger = loggers.get("uploadfileslogger");

module.exports = logger;