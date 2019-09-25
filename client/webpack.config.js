const path = require("path");
const HWP = require("html-webpack-plugin");

module.exports = {
    entry: path.join(__dirname, "/src/index.js"),
    output: {
        filename: "build.js",
        path: path.join(__dirname, "/dist")
    },
    module: {
      rules: [
          {
              test: /\.(js|jsx)$/,
              exclude: /(node_modules|bower_components)/,
              loader: 'babel-loader',
              options: { presets: ['env'], plugins: ['transform-class-properties','transform-object-rest-spread'] },
          },
          {
              test: /\.css$/,
              use: ['style-loader', 'css-loader'],
          },
          {
              test: /\.scss$/,
              use: ['style-loader', 'css-loader', 'sass-loader'],
          },
          {
              test: /\.(png|woff|woff2|eot|ttf|svg|gif|jpg|jpeg)$/,
              use: ['url-loader?limit=100000'],
          }
      ]
    },
    devServer: {
        contentBase: [path.join(__dirname, 'dist'), path.join(__dirname, 'static')],
        port: 7000,
        hotOnly: true,
        https: true,
        historyApiFallback: true,
        liveReload: false,
        watchOptions: {
          poll: true
        }
    },
    plugins:[
        new HWP(
           {template: path.join(__dirname,"/src/index.html")}
        )
    ]
 }
