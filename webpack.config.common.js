const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const FileManagerPlugin = require('filemanager-webpack-plugin');

const rootPath = path.resolve(__dirname, "./");
const srcPath = path.resolve(rootPath, "src");
const libPath = path.resolve(rootPath, "lib");
const tmpPath = path.resolve(rootPath, "tmp");

module.exports = {
  entry: srcPath + "/index.ts",
  output: {
    path: tmpPath,
    filename: "qr-code-styling.js",
    library: "QRCodeStyling",
    libraryTarget: "umd",
    libraryExport: "default"
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: /node_modules/
      },
      {
        enforce: "pre",
        test: /\.ts$/,
        loader: "eslint-loader",
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new FileManagerPlugin({
      events: {
        onEnd: {
          copy: [
            { source: tmpPath + '/**/*', destination: libPath },
          ],
          delete: [tmpPath],
        },
      },
    }),
  ],
  resolve: {
    extensions: [".ts", ".js"]
  }
};