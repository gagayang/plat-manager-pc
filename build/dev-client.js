require('eventsource-polyfill')

var hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true&path=__webpack_hmr&dynamicPublicPath=true')
hotClient.subscribe(function (event) {
  if(event.action === 'reload'){
    window.location.reload()
  }
})
