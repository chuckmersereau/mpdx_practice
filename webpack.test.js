'use strict';
/**
 * Webpack config for tests
 */

const assign = require('lodash/fp/assign');
const path = require('path');
const webpack = require('webpack');

const config = {
    devtool: 'inline-source-map',
    mode: 'development',
    module: {
        rules: [{
            test: /\.ts$/,
            use: [{
                loader: 'babel-loader'
            }, {
                loader: 'ts-loader'
            }],
            exclude: /node_modules/
        }, {
            test: /\.(css|scss|json|html|png|jpg|jpeg|gif)$/,
            use: 'null-loader'
        }]
    },
    resolve: {
        modules: [path.join(__dirname), 'node_modules', 'src'],
        extensions: ['.ts', '.js']
    },
    plugins: [
        new webpack.DefinePlugin({
            'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
    ]
};

module.exports = config;