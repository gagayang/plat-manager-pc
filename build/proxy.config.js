var logger = require('./logger')
var config = require('../config')
var path = require('path')
var jetpack = require('fs-jetpack')
var historyPath = './build/ask.json'
var history = jetpack.read(historyPath, 'json')

module.exports = function (mock, target) {
  "use strict";
  var proxy = ""
  if (mock) {
    var target = 'http://localhost:3001'
    var host = 'localhost:3001'
    proxy = {
      '/user/login': {
        target: 'http://localhost:3001',
        host: 'localhost:3001',
        // pathRewrite: {"^/api" : ""} //请求 /api/home/index  就会变成 localhost:3000/home/index
        pathRewrite: function (path, req) {
          logger.log(path)
          return '/login'
        }
      },
      '/user/info': {
        target: 'http://localhost:3001',
        host: 'localhost:3001',
        pathRewrite: function (path, req) {
          logger.log(path)
          return '/userInfo'
        }
      },
      '/logout': {
        target: 'http://localhost:3001',
        host: 'localhost:3001',
        pathRewrite: function (path, req) {
          logger.log(path)
          return '/logout'
        }
      },
      '/sys_code': {
        target: 'http://localhost:3001',
        host: 'localhost:3001',
        pathRewrite: function (path, req) {
          return '/meta-sys_code'
        }
      },
      '/tabb': {
        target: 'http://localhost:3001',
        host: 'localhost:3001',
        pathRewrite: function (path, req) {
          logger.log(path)
          return '/tabb'
        }
      },
      '/report/meta/*': {
        target: 'http://localhost:3001',
        host: 'localhost:3001',
        pathRewrite: function (path, req) {
          const pathArray = path.split("/")
          return '/meta-' + pathArray[pathArray.length - 1]
        }
      },
      '/report/data/*': {
        target: 'http://localhost:3001',
        host: 'localhost:3001',
        pathRewrite: function (path, req) {
          const pathArray = path.split("/")
          return '/data-' + pathArray[pathArray.length - 1]
        }
      },
      '/form/meta/*': {
        target: 'http://localhost:3001',
        host: 'localhost:3001',
        pathRewrite: function (path, req) {
          const pathArray = path.split("/")
          return '/form-meta-' + pathArray[pathArray.length - 1]
        }
      },
      '/form/submit/*': {
        target: 'http://localhost:3001',
        host: 'localhost:3001',
        pathRewrite: function (path, req) {
          const pathArray = path.split("/")
          return '/form-submit-' + pathArray[pathArray.length - 1]
        }
      },
      '/report/delete/*': {
        target: 'http://localhost:3001',
        host: 'localhost:3001',
        pathRewrite: function (path, req) {
          const pathArray = path.split("/")
          return '/delete-' + pathArray[pathArray.length - 1]
        },
      },
      '/tree': {
        target: 'http://localhost:3001',
        host: 'localhost:3001',
        pathRewrite: function (path, req) {
          return '/tree'
        }
      },
      '/dashboard/*': {
        target: 'http://localhost:3001',
        host: 'localhost:3001',
        pathRewrite: function (path, req) {
          const pathArray = path.split("/")
          return '/dashboard-' + pathArray[pathArray.length - 1]
        }
      },
      '/areaSelect': {
        target: 'http://localhost:3001',
        host: 'localhost:3001',
        pathRewrite: function (path, req) {
          return '/areaData'
        }
      },
      '/getSubBrandInfo': {
        target: 'http://localhost:3001',
        host: 'localhost:3001',
        pathRewrite: function (path, req) {
          return '/subBrandInfo'
        }
      },
      '/getBrandInfo': {
        target: 'http://localhost:3001',
        host: 'localhost:3001',
        pathRewrite: function (path, req) {
          return '/brandInfo'
        }
      },
      '/getExportInfo': {
        target: 'http://localhost:3001',
        host: 'localhost:3001',
        pathRewrite: function (path, req) {
          return '/exportInfo'
        }
      }
    }
  } else {
    console.log(target)
    proxy = {
      "/api-order": {
        target: 'http://192.168.60.246:33300',
        changeOrigin: true,
      },
      "**": {
        target: target,
        host: target,
        changeOrigin: true,
        pathRewrite: function (path, req) {
          logger.log("真实环境下 path的跳转拦截: " + path);
          return path
        }
      }
    }
  }
  return {
    stats: {colors: true},
    hot: true,
    inline: true,
    proxy: proxy,
    // historyApiFallback: {
    //   rewrites: [
    //     {from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html')},
    //   ],
    // },
    clientLogLevel: 'warning',
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: config.dev.host,
    port: config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? {warnings: false, errors: true}
      : false,
    publicPath: config.dev.assetsPublicPath,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    }
  }
}
