// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
var ip = require('ip')

var argv = require('../build/command')

var PROTOCOL = argv.https ? 'https' : 'http'
var DEV_PORT = 8080
var MOCK_SERVER_PORT = 3001

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.jsp'),
    indexHtml: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: true,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: DEV_PORT,
    mockServerPort: MOCK_SERVER_PORT,
    // 默认不打开浏览器...
    autoOpenBrowser: false,
    assetsSubDirectory: 'static',
    assetsPublicPath: `${PROTOCOL}://${ip.address()}:${DEV_PORT}/`,
    proxyTable: {},
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
