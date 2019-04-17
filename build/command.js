var yargs = require('yargs') // 参数工具类
var chalk = require('chalk') // node 日志类
var path = require('path')
var jetpack = require('fs-jetpack') // 文件操作增强
var logger = require('./logger') //  日志输出类

var argv

if (!argv) {
  argv = yargs.usage('Usage: $0 <command> [options]') // 设置命令格式
    .describe('project', 'Project name')
    .boolean('mock')
    .boolean('https')
    .boolean('alignment')
    .alias('h', 'help')
    .alias('m', 'mock')
    .alias('al', 'alignment')
    .alias('p', 'path')
    .argv
}

logger.log('选择的模式为 '+ argv.mock ? 'mock' : 'alignment')

module.exports = argv
