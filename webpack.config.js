/**
 * Webpack config for development
 */
const path = require('path');
const webpack = require('webpack');
const assign = require('lodash/fp/assign');
const concat = require('lodash/fp/concat');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
let config = require('./webpack.make');

const postcssLoader = {
    loader: 'postcss-loader',
    options: {
        plugins: [require('autoprefixer')({ browsers: ['last 2 version'] })]
    }
};

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
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules\//,
                loaders: ['eslint-loader']
            }, {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', postcssLoader]
            }, {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', postcssLoader, 'sass-loader']
            }
        ])
    }),
    plugins: concat(config.plugins, [
        new webpack.LoaderOptionsPlugin({
            options: {
                eslint: {
                    fix: true
                },
                sassLoader: {
                    includePaths: [path.resolve(__dirname, 'node_modules')],
                    sourceMaps: true,
                    sourceMapContents: true
                },
                cssLoader: {
                    sourceMaps: true
                }
            }
        }),
        new HtmlWebpackPlugin({
            template: './src/index.ejs',
            favicon: './src/images/mpdx-favicon.png',
            inject: 'body',
            minify: false
        }),
        new CopyWebpackPlugin([
            { from: 'assets' },
            { from: 'src/google144ccea737ed252d.html' }
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
