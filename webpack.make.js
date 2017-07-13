'use strict';
/**
 * Webpack default config
 */
const path = require('path');
const webpack = require('webpack');

const configEnv = process.env.NODE_ENV || 'development';

const config = {
    devtool: 'eval',
    entry: {
        app: './src/app.module.js',
        helpscout: './src/helpscout.js',
        moment_locales: './src/moment-locales.js'
    },
    externals: [{
        "window": "window",
        "google": "window.google"
    }],
    resolve: {
        alias: {
            config: path.join(__dirname, 'config', configEnv + '.js')
        },
        modules: [path.join(__dirname), "node_modules", "bower_components", "src"]
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loaders: ['babel-loader'],
            exclude: /node_modules|bower_components\//
        }, {
            test: /\.json/,
            use: "json-loader"
        }, {
            test: /\.html$/,
            use: "html-loader"
        }, {
            test: /\.(png|jpg|jpeg|gif)$/,
            use: 'file-loader'
        }, {
            test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            use: "url-loader?limit=10000&mimetype=application/font-woff"
        }, {
            test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            use: "file-loader"
        }]
    },
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin()
    ]
};

module.exports = config;