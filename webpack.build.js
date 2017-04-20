/**
 * Webpack config for builds
 */
const webpack = require('webpack');
const path = require('path');
const assign = require('lodash/fp/assign');
const concat = require('lodash/fp/concat');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const RollbarSourceMapPlugin = require('rollbar-sourcemap-webpack-plugin');
const rollbarAccessToken = 'b5fa42183785424198a13984ab2d2bd3';

let config = require('./webpack.make');

const configEnv = process.env.NODE_ENV || 'development';

let publicPath;
switch (configEnv) {
    case 'staging':
        publicPath = 'https://next.stage.mpdx.org';
        break;
    case 'next':
        publicPath = 'https://next.mpdx.org';
        break;
    default:
        publicPath = 'https://mpdx.org';
}

config = assign(config, {
    output: {
        path: path.join(__dirname, 'public'),
        publicPath: '/',
        filename: '[name].[hash].js',
        chunkFilename: '[name].[hash].js'
    },
    module: assign(config.module, {
        loaders: concat(config.module.loaders, [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader', 'postcss-loader'],
                    fallback: 'style-loader'
                })
            }, {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader', 'postcss-loader', 'sass-loader'],
                    fallback: 'style-loader'
                })
            }
        ])
    }),
    plugins: concat(config.plugins, [
        new webpack.DefinePlugin({
            'process.env': {
                TRAVIS_COMMIT: JSON.stringify(process.env.TRAVIS_COMMIT)
            }
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.UglifyJsPlugin(),
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
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            favicon: './src/images/mpdx-favicon.png',
            inject: 'body',
            minify: {
                html5: true
            }
        }),
        new CopyWebpackPlugin([
            { from: 'assets' }
        ]),
        new ExtractTextPlugin({
            filename: '[name].[hash].css'
        })
    ]),
    devtool: 'source-map'
});

if (process.env.TRAVIS_BRANCH === 'master' || process.env.TRAVIS_BRANCH === 'staging' || process.env.TRAVIS_BRANCH === 'next') {
    config.plugins.push(
        new RollbarSourceMapPlugin({
            accessToken: rollbarAccessToken,
            version: process.env.TRAVIS_COMMIT,
            publicPath: publicPath
        })
    );
}

module.exports = config;