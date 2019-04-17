var jsonServer = require('json-server')
var jetpack = require('fs-jetpack')
var fetch = require('isomorphic-fetch')
var ip = require('ip')
var _ = require('lodash')

// 虽然在 config/index.js 中已存在 MOCK_SERVER_PORT，但是如果在这里引用，
// 会再次执行 command.js，且运行环境与 npm scripts 已然不同
var MOCK_SERVER_PORT = 3001

// var config = require('../config')

var server = jsonServer.create()

var watchFiles = {}
var jsonFiles = jetpack.cwd('./mock/json/').find({ matching: '**/*.json' })

jsonFiles.forEach(function (path) {
  var code = path.split('.')[0]
  console.log(require('./json/' + path))
  watchFiles[code] = require('./json/' + path)
})

var router = jsonServer.router(watchFiles)

// maybe if the form
router.render = function (req, res) {
  if (_.isEmpty(res.locals.data) && req.query.formcode && req.query.method === 'submit') {
    res.jsonp({
      result: 1
    })
  } else {
    res.jsonp(res.locals.data)
  }
}

var middlewares = jsonServer.defaults()

server.use(middlewares)

server.use(function (req, res, next) {
  if (req.method === 'POST') {
    var mockAddress = 'http://' + ip.address() + ':' + MOCK_SERVER_PORT
    console.log(mockAddress)
    var fullPath = mockAddress + req.originalUrl
    fetch(fullPath, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(response) {
      return response.json()
    }, function() {
      console.log('Reject...')
    }).then(function(json) {
      res.jsonp(json)
    }).catch(function(err) {
      console.err(err)
    })
  } else {
    next()
  }
})

server.use(router)
server.listen(MOCK_SERVER_PORT)
