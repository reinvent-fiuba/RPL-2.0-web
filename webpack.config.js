const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path");
const Dotenv = require("dotenv-webpack");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = (env, argv) => {
  // Get the root path (assuming your webpack config is in the root of your project!)
  const currentPath = path.join(__dirname);

  // Create the fallback path (the production .env)
  const basePath = `${currentPath}/.env`;

  // We're concatenating the webpack mode name to our filename to specify the correct env file!
  const envPath = `${basePath}.${argv.mode}`;
  return {
    entry: "./src/index.js",
    output: {
      publicPath: "/",
      path: path.resolve(__dirname, "./dist"),
      filename: "index_bundle.[hash].js",
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader",
            },
          ],
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(png|jpg|gif|svg)$/i,
          use: ["file-loader"],
        },
        {
          test: /\.ttf$/,
          use: ["file-loader"],
        },
      ],
    },
    devServer: {
      historyApiFallback: true,
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: "./src/index.html",
        filename: "./index.html",
        favicon: "./src/favicon.ico",
      }),
      new Dotenv({ path: envPath, systemvars: true }),
      new MonacoWebpackPlugin({
        // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
        languages: ["cpp", "javascript", "python", "java", "go"],
      }),
      new BundleAnalyzerPlugin({ openAnalyzer: true, analyzerMode: "json" }),
      new CompressionPlugin(), // https://medium.com/@selvaganesh93/how-to-serve-webpack-gzipped-file-in-production-using-nginx-692eadbb9f1c
    ],
  };
};
