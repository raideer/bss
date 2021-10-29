const path = require('path')
const webpack = require('webpack')
const semver = require('semver')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const VERSION = semver.parse(require('./package.json').version)

const commitHash = require('child_process').execSync('git rev-parse HEAD').toString().trim();
const PROD = process.env.NODE_ENV === 'production'

module.exports = {
  mode: PROD ? 'production' : 'development',
  entry: {
    'ssplus.js': './src/ssplus.ts',
    styles: './src/css/main.scss'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]'
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
    new RemoveEmptyScriptsPlugin(),
    new MiniCssExtractPlugin({
      filename: "ssplus.css"
    }),
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
          MiniCssExtractPlugin.loader,
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
          'sass-loader'
        ]
      }
    ]
  }
}
