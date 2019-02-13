var winston = require('winston')

var loggers = {}


function getLogger(moduleName) {
  if (!loggers[moduleName]) {
    loggers[moduleName] = createNewLogger(moduleName)
  }

  return loggers[moduleName]
}

function createNewLogger(moduleName) {
  var logger = winston.createLogger({
		level: 'info',
		label: moduleName,
		transports: [
			new winston.transports.File({
				filename: moduleName == 'access' ? 'logs/access.log' : 'logs/app.log',
				format: winston.format.combine(
					winston.format.timestamp(),
					winston.format.label({label: moduleName}),
					winston.format.printf(info => `${info.timestamp} [${info.label}] [${info.level}]: ${info.message}`),
			)}),
			new winston.transports.Console({
				level: 'info',
				colorize: true,
				format: winston.format.combine(
					winston.format.colorize(),
					winston.format.timestamp(),
					winston.format.label({label: moduleName}),
					winston.format.printf(info => `${info.timestamp} [${info.label}] [${info.level}]: ${info.message}`),
				)
			})
		]
	})

	// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function(message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message)
  }
}

  return logger
}

// instantiate a new Winston Logger with the settings defined above
// var logger = winston.createLogger({
//   level: 'info',
//   transports: [
//     new winston.transports.File({
//       filename: 'logs/app.log',
//       format: winston.format.combine(
//         winston.format.timestamp())
//     }),
//     new winston.transports.Console({
//       level: 'info',
//       colorize: true,
//       format: winston.format.combine(
//         winston.format.colorize(),
//         winston.format.timestamp(),
// 				winston.format.printf((info) => {
// 					const {
// 						timestamp, label, level, message, ...args
// 					} = info;
		
// 					const ts = timestamp.slice(0, 19).replace('T', ' ');
// 					return `${ts} [${label}] [${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`;
// 				}),
//       )
//     })
//   ]
// })

module.exports = getLogger
