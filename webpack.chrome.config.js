const common = require('./webpack.common')
const ZipPlugin = require('zip-webpack-plugin')

const config = common('chrome')

config.plugins.push(
  new ZipPlugin({
    filename: `bss-chrome.zip`,
    exclude: [
      'node_modules'
    ]
  })
)

module.exports = config
