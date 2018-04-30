'use strict';

process.env.NODE_ENV = 'test';

var wallabyWebpack = require('wallaby-webpack');
var webpack = require('webpack');
var webpackPostprocessor = wallabyWebpack({
    devtool: 'source-map',
    entryPatterns: [
        'src/**/*.test.js'
    ],
    mode: 'development',
    module: {
        rules: [{
            test: /\.(json|html)$/,
            use: 'null-loader'
        }]
    },
    resolve: {
        extensions: ['.js']
    },
    plugins: [
        new webpack.DefinePlugin({
            'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        new webpack.NormalModuleReplacementPlugin(/\.(gif|png|jpg|jpeg|scss|css)$/, 'node-noop')
    ]
});


module.exports = function() {
    return {
        files: [
            { pattern: 'node_modules/angular/angular.js', instrument: false },
            { pattern: 'node_modules/angular-mocks/angular-mocks.js', instrument: false },
            { pattern: 'node_modules/angular-strap/dist/angular-strap.js', instrument: false },
            { pattern: 'node_modules/angular-strap/dist/angular-strap.tpl.js', instrument: false },
            { pattern: 'node_modules/ng-rollbar/ng-rollbar.js', instrument: false },
            { pattern: 'src/**/*.ts', load: false },
            { pattern: 'src/**/*.test.ts', load: false, ignore: true },
            { pattern: 'src/**/*.html', load: false, instrument: false }
        ],
        'tests': [
            { pattern: 'src/**/*.test.ts', load: false }
        ],
        testFramework: 'jasmine',
        postprocessor: webpackPostprocessor,
        setup: function() {
            window.__moduleBundler.loadTests();
        }
    };
};
