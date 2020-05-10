
const { createLogger, transports, format } = require('winston');
const { combine, timestamp, label, prettyPrint } = format;

  const logger = createLogger({
    format: combine(
      timestamp(),
      prettyPrint()
    ),
    transports: [
      new transports.Console(),
      new transports.File({ filename: 'combined.log' })
    ]
  });


module.exports = { logger }