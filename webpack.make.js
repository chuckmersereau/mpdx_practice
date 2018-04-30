'use strict';
/**
 * Webpack default config
 */

const path = require('path');
const webpack = require('webpack');

const config = {
    devtool: 'eval',
    entry: {
        analytics: './src/analytics.ts',
        app: './src/app.module.ts',
        helpscout: './src/helpscout.ts',
        moment_locales: './src/moment-locales.ts'
    },
    externals: [{
        'window': 'window',
        'google': 'window.google'
    }],
    resolve: {
        modules: [path.join(__dirname), 'node_modules', 'src'],
        extensions: ['.ts', '.js']
    },
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
            test: /\.html$/,
            use: 'html-loader'
        }, {
            test: /\.(png|jpg|jpeg|gif)$/,
            use: 'file-loader'
        }, {
            test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            use: 'url-loader?limit=10000&mimetype=application/font-woff'
        }, {
            test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            use: 'file-loader'
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
    ],
    mode: 'development'
};

module.exports = config;