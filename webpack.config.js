/**
 * Webpack config for development
 */
const path = require('path');
const webpack = require('webpack');
const assign = require('lodash/fp/assign');
const concat = require('lodash/fp/concat');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HappyPack = require('happypack');
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
        rules: concat(config.module.rules, [
            {
                enforce: 'pre',
                test: /\.ts$/,
                exclude: /node_modules\//,
                loaders: ['happypack/loader?id=lint']
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
            template: './src/index.html',
            favicon: './src/images/mpdx-favicon.png',
            inject: 'body',
            minify: false
        }),
        new CopyWebpackPlugin([
            { from: 'assets' },
            { from: 'src/google144ccea737ed252d.html' }
        ]),
        new webpack.WatchIgnorePlugin([
            /\.js$/,
            /\.d\.ts$/
        ]),
        new HappyPack({
            id: 'lint',
            loaders: [{
                loader: 'eslint-loader',
                options: {
                    fix: true
                }
            }]
        })
    ]),
    devtool: 'eval',
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
