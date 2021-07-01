const winston = require("winston");
const { format, loggers, transports, prettyPrint } = require("winston");
require('winston-daily-rotate-file');

const timezoned = () => {
    return new Date().toLocaleString('en-US', {
        timeZone: 'America/New_York'
    });
}

var filetransport = new (winston.transports.DailyRotateFile)({
    filename: "logs/relaymail-%DATE%-all.log",
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchived: true,
    maxSize: '10m',
    maxFiles: '1000',
    format: format.combine(format.timestamp({ format: timezoned }), format.prettyPrint()),
    level: "info"
});

filetransport.on('rotate', function (oldFileName, newFileName) { });

if (process.env.NODE_ENV !== "notproduction") {  //change to "production" before deploying... 
    loggers.add("rmlogger", {
        transports: [
            new transports.Console()
        ]
    });
} else {
    loggers.add("rmlogger", {
        transports: [
            filetransport
        ]
    });
}

const logger = loggers.get("rmlogger");

module.exports = logger;