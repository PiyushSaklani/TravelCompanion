// const winston = require('winston');
// const fs = require('fs');
// const path = require('path');

// const logsDirectory = path.join(__dirname, 'logs');
// fs.existsSync(logsDirectory) || fs.mkdirSync(logsDirectory);
// const logFilePath = path.join(logsDirectory, 'app.log');

// const logger = winston.createLogger({
//     level: 'info',
//     format: winston.format.simple(),
//     transports: [
//       new winston.transports.Console(),
//       new winston.transports.File({ filename: logFilePath })
//     ]
//   });

  
// module.exports = logger;


// ? log4js
const log4js = require('log4js');

log4js.configure({
  appenders: {
    file: { type: 'file', filename: 'logs/app.log' }
  },
  categories: {
    default: { appenders: ['file'], level: 'info' }
  }
});

const logger = log4js.getLogger();

module.exports = logger;
