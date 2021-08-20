const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin');
const rootPath = path.resolve(__dirname, './')
const srcPath = path.resolve(rootPath, 'src')
const libPath = path.resolve(rootPath, 'lib')

module.exports = {
  entry:  srcPath + '/index.ts',
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          ecma: 5
        },
      }),
    ],
  },
  devtool: "source-map",
  output: {
    path: libPath,
    library: {
      // do not specify a `name` here
      type: 'module'
    },
    filename: 'qr-code-styling.js',
    environment: {
      arrowFunction: false
    }
  },
  experiments: {
    outputModule: true
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      
    ]
  },
 
  resolve: {
    extensions: ['.ts', '.js']
  }
}
