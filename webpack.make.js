'use strict';
/**
 * Webpack default config
 */

const path = require('path');
const webpack = require('webpack');
const HappyPack = require('happypack');

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
            loader: 'happypack/loader?id=ts',
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
        }, {
            test: require.resolve('jquery'),
            use: [{
                loader: 'expose-loader',
                options: 'jQuery'
            }, {
                loader: 'expose-loader',
                options: '$'
            }]
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        new HappyPack({
            id: 'ts',
            loaders: [{
                path: 'babel-loader'
            }, {
                path: 'ts-loader',
                query: {
                    happyPackMode: true
                }
            }]
        })
    ],
    // optimization: {
    //     splitChunks: {
    //         cacheGroups: {
    //             commons: {
    //                 test: /[\\/]node_modules[\\/]/,
    //                 name: 'vendors',
    //                 chunks: 'all'
    //             }
    //         }
    //     }
    // },
    mode: 'development'
};

module.exports = config;