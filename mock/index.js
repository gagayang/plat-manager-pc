var nodemon = require('nodemon')
var logger = require('../build/logger')

nodemon({
  script: './mock/server.js',
  ext: 'js json',
  watch: ['mock/'],
  ignore: ['mock/index.js', 'mock/server.js']
})

// events
nodemon.on('start', function () {
  logger.log('Mock server is running... 🚀')
}).on('quit', function () {
  // console.log(chalk.cyan.bold('>_ Mock server is quit'))
}).on('restart', function (files) {
  logger.log('Mock server restarted due to: ' + files)
})
