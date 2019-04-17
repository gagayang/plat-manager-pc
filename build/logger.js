var chalk = require('chalk')
var format = require('util').format

var prefix = 'plat-manager'

var sep = chalk.bold.red('→') + '  '

module.exports = {
  // 输出log 日志到控制台
  log: function() {
    const message = format.apply(format, arguments)
    console.log(chalk.cyan(prefix), sep, message)
  },
  warngin: function() {
    const message = format.apply(format, arguments)
    console.log(chalk.yellow(prefix), sep, message)
  },
  fatal: function() {
    const message = format.apply(format, arguments)
    console.error(chalk.red(prefix), sep, message)
    process.exit(0)
  },
  success: function() {
    const message = format.apply(format, arguments)
    console.log(chalk.green(prefix), sep, message)
  }
}
