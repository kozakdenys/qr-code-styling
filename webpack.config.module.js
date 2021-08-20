const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

const rootPath = path.resolve(__dirname, './')
const srcPath = path.resolve(rootPath, 'src')
const libPath = path.resolve(rootPath, 'libs')

module.exports = {
  entry: srcPath + '/index.ts',
  output: {
    path: libPath,
    library: {
      // do not specify a `name` here
      type: 'module'
    },
    filename: 'qr-code-styling.module.js'
  },
  experiments: {
    outputModule: true
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [new CleanWebpackPlugin(), new ESLintPlugin({ fix: true })],
  resolve: {
    extensions: ['.ts', '.js']
  }
}
