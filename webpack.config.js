const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
  entry: ["./src/ts/app.ts", "./src/scss/app.scss"],

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/app.js",
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src/ts"),
      "@src": path.resolve(__dirname, "src"),
      "@img": path.resolve(__dirname, "src/img"),
    },
    extensions: [".ts", ".js", ".json"],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader",
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.s?[ac]ss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "img/[name].[ext]",
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/app.css",
    }),
  ],
};
