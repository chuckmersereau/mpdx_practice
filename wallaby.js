'use strict';

var assign = require('lodash/fp/assign');
var concat = require('lodash/fp/concat');

var path = require('path');
var wallabyWebpack = require('wallaby-webpack');
var webpack = require('webpack');
var webpackPostprocessor = wallabyWebpack({
    devtool: 'source-map',
    entryPatterns: [
        'src/tests.wallaby.js',
        'src/**/*.test.js'
    ],
    resolve: {
        alias: {
            config: path.join(__dirname, 'config', 'test.js')
        },
        modules: [path.join(__dirname), "node_modules", "bower_components", "src"]
    },
    module: {
        loaders: [{
            test: /\.(json|html)$/,
            use: 'null-loader'
        }]
    },
    plugins: [
        new webpack.NormalModuleReplacementPlugin(/\.(gif|png|jpg|jpeg|scss|css)$/, 'node-noop')
    ],
    externals: [{
        "window": "window",
        "google": "window.google"
    }]
});


module.exports = function(wallaby) {
    return {
        files: [
            {pattern: 'src/tests.wallaby.js', load: false, instrument: false},
            {pattern: 'src/**/*.js', load: false},
            {pattern: 'src/**/*.html', load: false, instrument: false},
            {pattern: 'src/**/*.test.js', ignore: true}
        ],
        "tests": [
            {pattern: 'src/**/*.test.js', load: false}
        ],
        testFramework: 'jasmine',
        postprocessor: webpackPostprocessor,
        setup: function() {
            window.__moduleBundler.loadTests();
        },
        compilers: {
            'src/**/*.js*': wallaby.compilers.babel({
                "presets": [
                    "env",
                    "stage-1"
                ],
                "plugins": [
                    "angularjs-annotate"
                ],
                "env": {
                    "test": {
                        "plugins": ["istanbul"]
                    }
                }
            })
        }
    };
};