'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const fs = require('fs')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const moment = require('moment')
const argv = require('yargs').argv
const env = config.build.env
const now = moment().format('YYYYMMDDHHmm')
const src = path.resolve(process.cwd(), 'src'); // 源码目录
//bi添加下载文件
const downHtml=new HtmlWebpackPlugin({
  filename: 'downpage.html',
  template: 'downpage.html',
  inject: false,
  favicon:'static/favicon.ico',
  minify: {
    removeComments: true,
    collapseWhitespace: true,
    removeAttributeQuotes: true
  },
  chunksSortMode: 'dependency'
});
//bi添加下载文件--end
const webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: argv.sourceMap,
      extract: true,
      usePostCSS: true // 好像没有用到
    })
  },
  devtool: '#source-map',
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath(path.join('js','[name].[chunkhash].' + now + '.js')), // 如果使用cdn 用日期作为版本 就不需要hash了 utils.assetsPath('js/[name].[chunkhash].js')
    chunkFilename: utils.assetsPath(path.join('js','[id].[chunkhash].' + now + '.js'))
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
        ENV_CONFIG: '"pro"',
        BASE_API: '"' + argv.path + '"',
        PROJECT: '"' + argv.project+ '"'
      }
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false,
          drop_console: true,//console
          pure_funcs: ['console.log']//移除console
        }
      },
      sourceMap: true,
      parallel: true
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath(path.join('css','[name].[chunkhash].' + now + '.css')), // 这里也就不需要hash了 理由同上
      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`,
      // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
      allChunks: true,
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
      favicon:'static/favicon.ico',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    // new HtmlWebpackPlugin({
    //   filename: 'iframe.html',
    //   template: 'iframe.html',
    //   inject: true,
    //   minify: {
    //     removeComments: true,
    //     collapseWhitespace: true,
    //     removeAttributeQuotes: true
    //     // more options:
    //     // https://github.com/kangax/html-minifier#options-quick-reference
    //   },
    //   // necessary to consistently work with multiple chunks via CommonsChunkPlugin
    //   chunksSortMode: 'dependency'
    // }),
    // keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks (module) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    // This instance extracts shared chunks from code splitted chunks and bundles them
    // in a separate chunk, similar to the vendor chunk
    // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      minChunks: 3
    }),

    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ]),
    // new webpack.DllPlugin({
    //   // 定义程序中打包公共文件的入口文件vendor.js
    //   context: process.cwd(),
    //
    //   // manifest.json文件的输出位置
    //   path: path.join(src, 'js', 'dll', '[name]-manifest.json'),
    //
    //   // 定义打包的公共vendor文件对外暴露的函数名
    //   name: '[name]_[hash]'
    // })
  ]
})
//判断只有bi项目添加下载页面
if(argv.project==='bi'){
  webpackConfig.plugins.push(downHtml);
}
if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

if (argv.uploadCDN) {
  var WebpackSftpClient = require('webpack-sftp-client'); // 5A60000NEF
  var localPath = path.resolve(__dirname, 'dist', argv.project);
  // http://vue-loader.vuejs.org/en/workflow/production.html
  webpackConfig.plugins = (webpackConfig.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    // HTMLWebpackPluginConfig,
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new WebpackSftpClient({
      port: '22',// 服务器端口
      host: '172.22.22.35',// 服务器地址
      username: 'platform',// 用户名
      password: 'winc123_4',//登录密码
      path: localPath, // 本地路径
      remotePath: '/opt/Inetpub/wwwroot/frontend/platform/'+argv.project+'/'+now, // 服务器路径
      verbose: true //控制台显示详细信息
    })
  ])
  webpackConfig.output.publicPath = '//download.winmdm.com/frontend/platform/' + argv.project+'/'+now;
  webpackConfig.output.path = path.resolve(__dirname, 'dist', argv.project, now);
}

module.exports = webpackConfig
