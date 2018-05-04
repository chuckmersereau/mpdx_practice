// Reference: http://karma-runner.github.io/0.12/config/configuration-file.html
module.exports = function karmaConfig(config) {
    config.set({
        frameworks: [
            'jasmine'
        ],
        reporters: [
            'super-dots',
            'coverage'
        ],
        files: [
            'src/tests.webpack.js'
        ],
        helpers: [
            'helpers/**/*.js'
        ],
        preprocessors: {
            'src/tests.webpack.js': ['webpack', 'sourcemap']
        },
        browsers: [
            'PhantomJS'
        ],
        client: {
            captureConsole: false
        },
        singleRun: true,
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
            noInfo: true
        }
    });
};
