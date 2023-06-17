const path = require('path')
const webpack = require('webpack')
const semver = require('semver')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const VERSION = semver.parse(require('./package.json').version)
const ZipPlugin = require('zip-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");

const version = `${VERSION.major}.${VERSION.minor}.${VERSION.patch}`;
const commitHash = require('child_process').execSync('git rev-parse HEAD').toString().trim();

module.exports = {
  mode: 'production',
  entry: {
    'bss.js': './src/bss.ts',
    styles: './src/css/main.scss'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.mjs'],
    alias: {
      util: path.resolve(__dirname, './src/util/'),
      css: path.resolve(__dirname, './src/css/'),
      module: path.resolve(__dirname, './src/module/'),
      core: path.resolve(__dirname, './src/core/')
    }
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'assets', to: 'assets'
        },
        {
          from: "./src/manifest.json",
          to: "./manifest.json",
          transform: {
            transformer(content, path) {
              let manifest = content.toString()
              manifest = manifest.replace('__VERSION__', version)
              return Promise.resolve(manifest)
            }
          }
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: "bss.css"
    }),
    new RemoveEmptyScriptsPlugin(),
    new webpack.DefinePlugin({
      __version_major__: VERSION.major,
      __version_minor__: VERSION.minor,
      __version_patch__: VERSION.patch,
      __version_prerelease__: VERSION.prerelease,
      __git_commit__: JSON.stringify(commitHash)
    }),
    new ZipPlugin({
      filename: `bss-chrome.zip`,
      exclude: [
        'node_modules'
      ]
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
            loader: 'string-replace-loader',
            options: {
              search: "~@resource",
              replace: 'chrome-extension://__MSG_@@extension_id__',
              flags: 'g'
            }
          },
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
