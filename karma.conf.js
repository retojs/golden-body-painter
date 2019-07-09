//
// The Karma test runner is needed to debug tests involving canvas.
// With jest and jest-canvas-mock these tests are causing a heap out of memory error.

let webpackConfig = require("./webpack.test.config");

module.exports = function (config) {
    config.set({
        browsers: ['Chrome'],
        frameworks: ['jasmine'],
        reporters: ['progress', 'kjhtml'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        singleRun: true,
        concurrency: Infinity,

        client: {
            clearContext: false
        },

        basePath: '',
        files: [
            'src/app/**/*.test.ts',
        ],
        preprocessors: {
            'src/app/**/*.test.ts': ['webpack', 'sourcemap'],
        },
        mime: {
            "text/x-typescript": ["ts", "tsx"],
        },

        webpack: webpackConfig,
        webpackMiddleware: {
            stats: 'errors-only'
        }
    })
};
