/**
 * Webpack config for development
 */
const path = require('path');
const webpack = require('webpack');
const assign = require('lodash/fp/assign');
const concat = require('lodash/fp/concat');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');

let config = require('./webpack.make');

config = assign(config, {
    output: {
        path: path.join(__dirname, 'public'),
        publicPath: 'http://localhost:8080/',
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js'
    },
    module: assign(config.module, {
        loaders: concat(config.module.loaders, [
            {
                enforce: "pre",
                test: /\.js$/,
                exclude: /node_modules|bower_components\//,
                loaders: ['eslint-loader']
            }, {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader']
            }, {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
            }
        ])
    }),
    plugins: concat(config.plugins, [
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [
                    autoprefixer({
                        browsers: ['last 2 version']
                    })
                ],
                eslint: {
                    parser: 'babel-eslint'
                },
                sassLoader: {
                    includePaths: [path.resolve(__dirname, 'node_modules'), path.resolve(__dirname, 'bower_components')],
                    sourceMaps: true,
                    sourceMapContents: true
                },
                cssLoader: {
                    sourceMaps: true
                }
            }
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            favicon: './src/images/mpdx-favicon.png',
            inject: 'body',
            minify: false
        }),
        new CopyWebpackPlugin([
            { from: 'assets' }
        ])
    ]),
    devServer: {
        contentBase: './public',
        stats: {
            modules: false,
            cached: false,
            colors: true,
            chunk: false
        },
        historyApiFallback: true
    }
});

module.exports = config;
