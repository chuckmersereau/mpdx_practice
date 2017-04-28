/**
 * Webpack config for tests
 */

const webpack = require('webpack');
const assign = require('lodash/fp/assign');
const concat = require('lodash/fp/concat');
const autoprefixer = require('autoprefixer');
const path = require('path');

let config = require('./webpack.make');

config = assign(config, {
    entry: null,
    devtool: 'inline-source-map',
    output: {},
    resolve: assign(config.resolve, {
        alias: {
            config: path.join(__dirname, 'config', 'test.js')
        }
    }),
    module: assign(config.module, {
        loaders: concat(config.module.loaders, [
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: [
                    /node_modules/,
                    /\.test\.js$/
                ],
                use: 'isparta-loader'
            }, {
                test: /\.css$|\.scss$/,
                use: 'null-loader'
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
                    includePaths: [path.resolve(__dirname, 'node_modules'), path.resolve(__dirname, 'bower_components')]
                }
            }
        })
    ])
});

module.exports = config;