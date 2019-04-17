var path = require('path')
var argv = require('./command')
var alignment = argv.alignment
var requestPath = argv.path
var devConfig = require('./webpack.dev.conf.js')
var proxyConfig = require('./proxy.config')
var WebpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");
var _ = require('lodash')
var ip = require('ip')
var logger = require('./logger.js')

var proxy = ""
process.traceDeprecation = true
process.noDeprecation = true
var opn = require('opn')
var compiler = webpack(devConfig);
if (alignment) {
  if(!requestPath) {
    logger.error("您没有配置真实环境的后台host 地址，请在 /build/host-map.json中增加");
    return false
  }
  proxy = proxyConfig(false, requestPath)
  logger.log("选择的项目 真实地址为: " + requestPath)
} else {
  require('../mock')
  proxy = proxyConfig(true)
}

var server = new WebpackDevServer(compiler, proxy)

server.listen(proxy.port, proxy.host, function() {
  "use strict";
  logger.log("dev-server 启动在" + proxy.port + " 端口")
  opn('http://'+ip.address() + ":" +proxy.port);
  // opn('http://'+ip.address() + ":" +proxy.port, {app: ['google chrome', '--incognito']});
});
