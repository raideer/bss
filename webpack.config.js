const path = require('path')
const webpack = require('webpack')
const semver = require('semver')

const VERSION = semver.parse(require('./package.json').version)

const commitHash = require('child_process').execSync('git rev-parse HEAD').toString().trim();

module.exports = {
  mode: 'development',
  entry: './src/ssplus.user.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'ssplus.user.js'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      util: path.resolve(__dirname, './src/util/'),
      css: path.resolve(__dirname, './src/css/'),
      module: path.resolve(__dirname, './src/module/'),
      core: path.resolve(__dirname, './src/core/'),
      react: 'preact-compat',
      'react-dom': 'preact-compat'
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      __version_major__: VERSION.major,
      __version_minor__: VERSION.minor,
      __version_patch__: VERSION.patch,
      __version_prerelease__: VERSION.prerelease,
      __git_commit__: JSON.stringify(commitHash)
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      },
      {
        test: /\.(s[ac]ss|css)$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env'
                  ]
                ]
              }
            }
          },
          // Compiles Sass to CSS
          'sass-loader'
        ]
      }
    ]
  }
}
