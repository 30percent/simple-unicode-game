const path = require('path');
const webpack = require('webpack')
const _ = require('lodash');
const DashboardPlugin = require('webpack-dashboard/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const nodeEnv = !_.isEmpty(process.env.NODE_ENV) ? process.env.NODE_ENV : 'development';
console.info(`Node Env: ${nodeEnv}`);
const isProd = nodeEnv === 'production';

module.exports = {
  entry: {
    app: './src/index.ts',
    vendor: './src/vendor.ts'
  },
  mode: nodeEnv,
  plugins: [
    new DashboardPlugin(), 
    new webpack.DefinePlugin({
      'process.env': {
        // eslint-disable-line quote-props
        NODE_ENV: JSON.stringify(nodeEnv)
      }
    }),
    new HtmlWebpackPlugin({
      title: 'Typescript Webpack Starter',
      template: 'src/index.html'
    }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor',
    //   minChunks: Infinity,
    //   filename: 'vendor.bundle.js'
    // }),
    new webpack.LoaderOptionsPlugin({
        options: {
            tslint: {
                emitErrors: true,
                failOnHint: true
            }
        }
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'static',
          to: 'static',
          context: 'src/'
        }
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {  
        test: /\.(ttf|eot|woff|woff2)$/,
        use: 'file-loader'
      },
      { test: /\.html$/, use: 'html-loader' },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },  
  devtool: (isProd) ? undefined : 'inline-source-map',
  // output: {
  //   filename: 'bundle.js',
  //   path: path.resolve(__dirname, 'dist'),
  // },
  devServer: {
    contentBase: path.join(__dirname, 'dist/'),
    compress: true,
    port: 3000,
    hot: true
  }
};