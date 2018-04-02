const webpack = require('webpack');
const nodeEnv = process.env.NODE_ENV || 'production';
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');


module.exports = {
  devtool: 'source-map',
  entry: ['./src/js/app.js', './src/scss/styles.scss'],
  output: {
    filename: 'static/js/main.js'
  },
  module: {
    rules: [
        {
            test: /\.(js|es6)$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
              presets: ['es2015']
            }
        },
        {
            test: /\.(js|es6)$/,
            exclude: /node_modules/,
            loader: 'eslint-loader'
        },
        {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract({
                use: [{
                    loader: 'css-loader',
                    options: { minimize: true }
                },{
                    loader: 'sass-loader',
                }]
            })
        }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      },
      sourceMap: true
    }),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify(nodeEnv) }
    }),
    new StyleLintPlugin(),
    new ExtractTextPlugin({ // define where to save the file
      filename: 'static/css/styles.css',
      allChunks: true
    }),
  ]
};

