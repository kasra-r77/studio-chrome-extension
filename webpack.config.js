const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HTMLPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "cheap-module-source-map",
  entry: {
    index: path.resolve("./src/index.tsx"),
    background: path.resolve("./src/background/background.ts"),
    contentScript: path.resolve("./src/content/contentScript.ts"),
  },
  module: {
    rules: [
      { use: "ts-loader", test: /\.(ts)x?$/, exclude: /node_modules/ },
      {
        use: ["style-loader", "css-loader"],
        test: /\.css$/i,
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve("src/assets/icon.png"),
          to: path.resolve("dist"),
        },
        {
          from: path.resolve("src/assets/studio-logo.png"),
          to: path.resolve("dist"),
        },
        {
          from: path.resolve("src/assets/yt.svg"),
          to: path.resolve("dist"),
        },
        {
          from: path.resolve("src/assets/download-icon.png"),
          to: path.resolve("dist"),
        },
        {
          from: path.resolve("src/assets/icon-white.png"),
          to: path.resolve("dist"),
        },
        {
          from: path.resolve("src/assets/manifest.json"),
          to: path.resolve("dist"),
        },
      ],
    }),
    new HTMLPlugin({
      title: "Studio",
      filename: "index.html",
      chunks: ["index"],
    }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].js",
  },
};
