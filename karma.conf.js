// Reference: http://karma-runner.github.io/0.12/config/configuration-file.html
module.exports = function karmaConfig(config) {
    config.set({
        frameworks: [
            'jasmine'
        ],
        reporters: [
            'spec',
            'coverage'
        ],
        files: [
            'src/tests.webpack.js'
        ],
        preprocessors: {
            'src/tests.webpack.js': ['webpack', 'sourcemap']
        },
        browsers: [
            'PhantomJS'
        ],
        client: {
            captureConsole: true
        },
        singleRun: true,
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
