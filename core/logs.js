const winston = require('winston')
const chalk = require('chalk')

module.exports = winston.createLogger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf((info) => {
      return `${info.timestamp} [${chalk.bold(info.level)}]${info.reqId ? ` [${chalk.bold(chalk.yellow(info.reqId))}]` : ''}${info.userId ? ` [${chalk.bold(chalk.cyan(info.userId))}]` : ''}${info.user ? ` [${chalk.magenta(info.user)}]` : ''}: ${info.message}`
    }),
  )
})
