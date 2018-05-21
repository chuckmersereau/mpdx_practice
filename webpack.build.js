/**
 * Webpack config for builds
 */
const webpack = require('webpack');
const path = require('path');
const assign = require('lodash/fp/assign');
const concat = require('lodash/fp/concat');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const RollbarSourceMapPlugin = require('rollbar-sourcemap-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const rollbarAccessToken = '9b953d96d0e145f9a4b70b41b1390c3b';

let config = require('./webpack.make');

const configEnv = process.env.NODE_ENV || 'development';

let publicPath;
switch (configEnv) {
    case 'staging':
        publicPath = 'https://stage.mpdx.org';
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
        filename: '[name].[chunkhash].js',
        chunkFilename: '[name].[chunkhash].js'
    },
    module: assign(config.module, {
        rules: concat(config.module.rules, [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: { minimize: true } },
                    postcssLoader
                ]
            }, {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: { minimize: true } },
                    postcssLoader,
                    'sass-loader'
                ]
            }
        ])
    }),
    plugins: concat(config.plugins, [
        new webpack.DefinePlugin({
            'process.env': {
                TRAVIS_COMMIT: JSON.stringify(process.env.TRAVIS_COMMIT)
            }
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                sassLoader: {
                    includePaths: [path.resolve(__dirname, 'node_modules')]
                }
            }
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            favicon: './src/images/mpdx-favicon.png',
            inject: 'body',
            minify: {
                html5: true
            },
            env: configEnv
        }),
        new CopyWebpackPlugin([
            { from: 'assets' },
            { from: 'src/google144ccea737ed252d.html' }
        ]),
        new MiniCssExtractPlugin({
            filename: '[name].[chunkhash].css'
        }),
        new WebpackMd5Hash()// ,
        // new UglifyJsPlugin({
        //     parallel: true,
        //     sourceMap: true,
        //     uglifyOptions: {
        //         ecma: 5
        //     }
        // })
    ]),
    mode: 'production',
    devtool: 'source-map' // do not change, needed for rollbar and js size
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
