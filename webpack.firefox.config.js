const common = require('./webpack.common')
const ZipPlugin = require('zip-webpack-plugin')

const config = common('firefox')

config.plugins.push(
  new ZipPlugin({
    filename: 'bss-firefox.zip',
    exclude: [
      'source'
    ]
  }),
  new ZipPlugin({
    filename: 'bss-firefox-source.zip',
    include: [
      'source'
    ]
  })
)

module.exports = config
