// Reference: http://karma-runner.github.io/0.12/config/configuration-file.html
module.exports = function karmaConfig(config) {
    config.set({
        frameworks: [
            'jasmine'
        ],
        reporters: [
            'super-dots',
            'spec',
            'coverage'
        ],
        files: [
            { pattern: 'node_modules/angular/angular.js', instrument: false },
            { pattern: 'node_modules/angular-mocks/angular-mocks.js', instrument: false },
            { pattern: 'node_modules/angular-strap/dist/angular-strap.js', instrument: false },
            { pattern: 'node_modules/angular-strap/dist/angular-strap.tpl.js', instrument: false },
            { pattern: 'node_modules/ng-rollbar/ng-rollbar.js', instrument: false },
            'src/tests.webpack.ts'
        ],
        helpers: [
            'helpers/**/*.js'
        ],
        preprocessors: {
            'src/tests.webpack.ts': ['webpack']
        },
        browsers: [
            'PhantomJS'
        ],
        client: {
            captureConsole: false
        },
        singleRun: true,
        specReporter: {
            suppressErrorSummary: false,
            suppressFailed: false,
            suppressPassed: true,
            suppressSkipped: true,
            showSpecTiming: false,
            failFast: true
        },
        superDotsReporter: {
            icon: {
                success: '.',
                failure: 'X',
                ignore: 'i'
            },
            color: {
                success: 'green',
                failure: 'red',
                ignore: 'grey'
            }
        },
        coverageReporter: {
            reporters: [
                { type: 'lcovonly', subdir: '.' }
            ]
        },
        webpack: require('./webpack.test'),
        webpackMiddleware: {
            stats: 'errors-only'
        }
    });
};
