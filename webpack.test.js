'use strict';
/**
 * Webpack config for tests
 */

const assign = require('lodash/fp/assign');
const concat = require('lodash/fp/concat');
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
                test: /\.css$|\.scss$/,
                use: 'null-loader'
            }
        ])
    })
});

module.exports = config;