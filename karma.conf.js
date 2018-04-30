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
            captureConsole: true
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
