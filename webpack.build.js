/**
 * Webpack config for builds
 */
const webpack = require('webpack');
const path = require('path');
const assign = require('lodash/fp/assign');
const concat = require('lodash/fp/concat');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const RollbarSourceMapPlugin = require('rollbar-sourcemap-webpack-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');

const rollbarAccessToken = '9b953d96d0e145f9a4b70b41b1390c3b';

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

const postcssLoader = {
    loader: 'postcss-loader',
    options: {
        plugins: [ require('autoprefixer')({ browsers: ['last 2 version'] }) ]
    }
};

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
                    use: ['css-loader', postcssLoader],
                    fallback: 'style-loader'
                })
            }, {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader', postcssLoader, 'sass-loader'],
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
        new MinifyPlugin({
        }, {
            comments: false,
            sourceMap: false
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                sassLoader: {
                    includePaths: [path.resolve(__dirname, 'node_modules')]
                }
            }
        }),
        new MinifyPlugin({
        }, {
            comments: false,
            sourceMap: true
        }),
        new HtmlWebpackPlugin({
            template: './src/index.ejs',
            favicon: './src/images/mpdx-favicon.png',
            inject: 'body',
            minify: {
                html5: true
            },
            env: configEnv
        }),
        new CopyWebpackPlugin([
            { from: 'assets' }
        ]),
        new ExtractTextPlugin({
            filename: '[name].[hash].css'
        })
    ])
});

if (!process.env.TRAVIS_PULL_REQUEST && (process.env.TRAVIS_BRANCH === 'master' || process.env.TRAVIS_BRANCH === 'staging' || process.env.TRAVIS_BRANCH === 'next')) {
    console.log('Uploading sourcemaps to Rollbar');
    config.plugins.push(
        new RollbarSourceMapPlugin({
            accessToken: rollbarAccessToken,
            version: process.env.TRAVIS_COMMIT,
            publicPath: publicPath
        })
    );
}

module.exports = config;
