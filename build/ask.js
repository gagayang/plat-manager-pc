var inquirer = require('inquirer')
var jetpack = require('fs-jetpack')
var yargs = require('yargs')
var _ = require('lodash')
var moment = require('moment')
var spawn = require('child_process').spawn
var historyPath = './build/ask.json'

var history = jetpack.read(historyPath, 'json')
if (!jetpack.exists(historyPath)) {
  jetpack.file(historyPath, {
    content: {
      project: 0,
      mock: true,
      alignment: false,
      address: "",
      buildSourceMap: false
    }
  })
}
var history = jetpack.read(historyPath, 'json')
var mapHost = jetpack.read('./build/host-map.json', 'json')
var list = []
for(const i in mapHost){
  list.push({
    name: i,
    value: mapHost[i]
  })
}
argv = yargs.usage('Usage: $0 <command> [options]')
.boolean('dev')
.boolean('build')
  .argv

var questions = []
if (argv.dev) {
  questions.push({
    type: 'confirm',
    name: 'mock',
    message: '是否启动mock环境 ? ',
    default: history.mock
  },{
    when: function(response){
      return !response.mock
    },
    type: 'list',
    name: 'address',
    default: history.address || 0,
    message: '选一个真实环境的地址',
    choices: list
  })
} else if (argv.build) {}

inquirer.prompt(questions).then(function (answers) {
  var command
  if (argv.dev) {
    command = 'npm run _dev'
  } else if (argv.build) {
  }
  command += ' -- --project ' + answers.project
  if (argv.dev) {
    if (answers.mock) {
    } else{
      command += ' --alignment'
      var path = answers.address
      command += ' --path ' + path
    }
  } else {
  }
  // write back answers to history
  history = _.assign(history, answers)
  jetpack.writeAsync(historyPath, history).then(() => {}, (err) => {console.log(err)})

  // preserve color when executing child_process.spawn
  // reference to http://stackoverflow.com/questions/7725809/preserve-color-when-executing-child-process-spawn
  var cmd = ''

  if (/^win/.test(process.platform)) {
    cmd = spawn('cmd', ['/s', '/c', command], { stdio: 'inherit' });
  } else {
    cmd = spawn('/bin/sh', ['-c', command], { stdio: 'inherit' })
  }
  cmd.stdout.on('data', function (data) {
    console.log(data)
    process.stdout.write(data)
  })

  cmd.stderr.on('data', function (data) {
    process.stderr.write(data)
  })

  cmd.on('exit', function (code) {
    console.log(code)
  })
}, function (err) {
  console.log(err)
}).catch(() => {})
