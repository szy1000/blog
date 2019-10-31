const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const { filename, pathname } = require('../config/config')
console.log(filename, pathname)

console.log(path.resolve(__dirname, `../${pathname}`),)
module.exports = {
  entry: './src/index.tsx',
  devServer: {
    port: 8080,
    overlay: {
      errors: true,
      warings: false,
    },
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js', '.jsx' ]
  },
  output: {
    path: path.resolve(__dirname, `../${pathname}`),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js|jsx|tx|tsx$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      },
      {
        test: /\.js|jsx|tx|tsx$/,
        use: ['babel-loader', 'ts-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        use: [{
          loader: 'style-loader' // creates style nodes from JS strings
        }, {
          loader: 'css-loader' // translates CSS into CommonJS
        }, {
          loader: 'less-loader' // compiles Less to CSS
        }]
      }
    ]
  },
  mode: 'production',
  performance: {
    hints: false
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'webpack',
      template: path.resolve(__dirname, "../src/index.html"),
    })
  ]
}
