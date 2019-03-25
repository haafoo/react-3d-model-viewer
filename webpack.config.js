const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const htmlWebpackPlugin = new HtmlWebpackPlugin({
  template: path.join(__dirname, 'examples/src/index.html'),
  filename: './index.html'
})
const webpack = require('webpack')

module.exports = {
  entry: path.join(__dirname, 'examples/src/index.js'),
  output: {
    // path: path.resolve(__dirname, 'dist'),
    path: path.join(__dirname, 'examples/dist'),
    filename: 'index.js'
    // publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.stl$/,
        use: [{
          loader: 'file-loader',
          options: {}
        }]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    htmlWebpackPlugin,
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    hot: true
  }
}