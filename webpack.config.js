const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const rootPath = path.resolve(__dirname, "./");
const srcPath = path.resolve(rootPath, "src");
const libPath = path.resolve(rootPath, "lib");

const config = {
  entry: srcPath + "/index.ts",
  output: {
    path: libPath,
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
  plugins: [new CleanWebpackPlugin()],
  resolve: {
    extensions: [".ts", ".js"]
  }
};

module.exports = (env, argv) => {
  if (argv.mode === "development") {
    config.devtool = "inline-source-map";
    config.watch = true;
    config.mode = argv.mode;
  }

  if (argv.mode === "production") {
    config.devtool = "source-map";
    config.mode = argv.mode;
  }

  return config;
};
