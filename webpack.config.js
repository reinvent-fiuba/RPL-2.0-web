const HtmlWebPackPlugin = require("html-webpack-plugin");
const DotenvPlugin = require('webpack-dotenv-plugin');
const path = require('path');
var dotenv = require('dotenv').config({path: __dirname + '/.env'});

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }

    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html'
    }),
    new webpack.DefinePlugin({
      "process.env": dotenv.parsed
  }),
  ]
};
