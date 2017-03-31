'use strict';

// Modules
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = function makeWebpackConfig(options) {
    /**
     * Environment type
     * BUILD is for generating minified builds
     * TEST is for generating test builds
     */
    let BUILD = !!options.BUILD;
    let TEST = !!options.TEST;

    const configEnv = options.CONFIG || process.env.NODE_ENV || 'development';

    /**
     * Config
     * Reference: http://webpack.github.io/docs/configuration.html
     * This is the object where all configuration gets set
     */
    let config = {};

    /**
     * Entry
     * Reference: http://webpack.github.io/docs/configuration.html#entry
     * Should be an empty object if it's generating a test build
     * Karma will set this when it's a test build
     */
    if (!TEST) {
        config.entry = {
            app: './src/app.module.js'
        };
    }

    /**
     * Output
     * Reference: http://webpack.github.io/docs/configuration.html#output
     * Should be an empty object if it's generating a test build
     * Karma will handle setting it up for you when it's a test build
     */
    if (TEST) {
        config.output = {};
    } else {
        config.output = {
            // Absolute output directory
            path: path.join(__dirname, 'public'),

            // Output path from the view of the page
            // Uses webpack-dev-server in development
            publicPath: BUILD ? '/' : 'http://localhost:8080/',

            // Filename for entry points
            // Only adds hash in build mode
            filename: BUILD ? '[name].[hash].js' : '[name].bundle.js',

            // Filename for non-entry points
            // Only adds hash in build mode
            chunkFilename: BUILD ? '[name].[hash].js' : '[name].bundle.js'
        };
    }

    /**
     * Resolve
     * Reference: http://webpack.github.io/docs/configuration.html#resolve
     * Sets root to node_modules, but allows backup modules from bower_components
     */
    config.resolve = {
        alias: {
            config: path.join(__dirname, 'config', configEnv + '.js')
        },
        modules: [path.join(__dirname), "node_modules", "bower_components"]
    };

    /**
     * Devtool
     * Reference: http://webpack.github.io/docs/configuration.html#devtool
     * Type of sourcemap to use per build type
     */
    if (TEST) {
        config.devtool = 'inline-source-map';
    } else if (BUILD) {
        config.devtool = 'source-map';
    } else {
        config.devtool = 'eval';
    }

    config.externals = [{
        "window": "window",
        "google": "window.google"
    }];

    /**
     * Loaders
     * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
     * List: http://webpack.github.io/docs/list-of-loaders.html
     * This handles most of the magic responsible for converting modules
     */

        // Initialize module
    config.module = {
        loaders: [{
        //     enforce: 'pre',
        //     test: /\.component\.js$/,
        //     use: componentHotLoader,
        //     exclude: [/bower_components/, /node_modules/, /\.test\.js/]
        // },{
            // JS LOADER
            // Reference: https://github.com/babel/babel-loader
            // Transpile .js files using babel-loader
            // Compiles ES6 and ES7 into ES5 code
            test: /\.js$/,
            loaders: ['babel-loader'],
            exclude: /node_modules|bower_components\//
        // }, {
        //     // HTML Modal Template LOADER
        //     // Reference: https://github.com/WearyMonkey/ngtemplate-loader
        //     // Allow loading html through js
        //     test: /\.modal.html$/,
        //     loaders: ["ngtemplate?relativeTo=" + encodeURIComponent(path.resolve(process.cwd(), './src/')), "html"]
        }, {
            test: /\.json/,
            use: "json-loader"
        }, {            // HTML LOADER
            // Reference: https://github.com/WearyMonkey/ngtemplate-loader
            // Allow loading html through js
            test: /\.html$/,
            use: "html-loader"
        }, {
            // ASSET LOADER
            // Reference: https://github.com/webpack/file-loader
            // Copy png, jpg, jpeg, gif, svg, woff, woff2, ttf, eot files to output
            // Rename the file using the asset hash
            // Pass along the updated reference to your code
            // You can add here any file extension you want to get copied to your output
            test: /\.(png|jpg|jpeg|gif)$/,
            use: 'file-loader'
        }, {
            test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            use: "url-loader?limit=10000&mimetype=application/font-woff"
        }, {
            test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            use: "file-loader"
        }]
    };

    // ISPARTA LOADER
    // Reference: https://github.com/ColCh/isparta-instrumenter-loader
    // Instrument JS files with Isparta for subsequent code coverage reporting
    // Skips node_modules and files that end with .test.js
    if (TEST) {
        config.module.loaders.push({
            enforce: 'pre',
            test: /\.js$/,
            exclude: [
                /node_modules/,
                /\.test\.js$/
            ],
            use: 'isparta-loader'
        });
    }

    if (!TEST) {
        // CSS LOADER
        // Reference: https://github.com/webpack/css-loader
        // Allow loading css through js
        //
        // Reference: https://github.com/postcss/postcss-loader
        // Postprocess your css with PostCSS plugins
        var cssLoader = {
            test: /\.css$/,
            // Reference: https://github.com/webpack/extract-text-webpack-plugin
            // Extract css files in production builds
            //
            // Reference: https://github.com/webpack/style-loader
            // Use style-loader in development for hot-loading
            use: ExtractTextPlugin.extract({
                use: ['css-loader', 'postcss-loader'],
                fallback: 'style-loader'
            })
        };

        // SASS LOADER
        // Reference: https://github.com/jtangelder/sass-loader
        // Allow loading inline sass through js
        //
        var sassLoader = {
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
                use: ['css-loader', 'postcss-loader', 'sass-loader'],
                fallback: 'style-loader'
            })
        };
        if (!BUILD) {
            cssLoader.use = ['style-loader', 'css-loader', 'postcss-loader'];
            sassLoader.use = ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'];
        }
        // Add cssLoader to the loader list
        config.module.loaders.push(cssLoader);
        config.module.loaders.push(sassLoader);
    } else {
        // Skip loading styles in test mode
        // Reference: https://github.com/webpack/null-loader
        // Return an empty module
        var nullLoader = {
            test: /\.css$|\.scss$/,
            // Reference: https://github.com/webpack/style-loader
            // Use style-loader in development for hot-loading
            use: 'null-loader'
        };
        config.module.loaders.push(nullLoader);
    }

    if (!TEST && !BUILD) {
        config.module.loaders.push({
            enforce: "pre",
            test: /\.js$/,
            exclude: /node_modules|bower_components\//,
            loaders: ['eslint-loader']
        });
    }

    /**
     * Plugins
     * Reference: http://webpack.github.io/docs/configuration.html#plugins
     * List: http://webpack.github.io/docs/list-of-plugins.html
     */
    config.plugins = [
        // Reference: https://github.com/webpack/extract-text-webpack-plugin
        // Extract css files
        // Disabled when in test mode or not in build mode
        new ExtractTextPlugin({
            filename: '[name].[hash].css',
            disable: !BUILD || TEST
        })
    ];

    var loaderOptions = {
        postcss: [
            autoprefixer({
                browsers: ['last 2 version']
            })
        ],
        eslint: {
            parser: 'babel-eslint'
        },
        sassLoader: {
            includePaths: [path.resolve(__dirname, 'node_modules'), path.resolve(__dirname, 'bower_components')]
        }
        // ...other configs that used to directly on `modules.exports`
    };
    if (!BUILD && !TEST) {
        loaderOptions.sassLoader.sourceMaps = true;
        loaderOptions.sassLoader.sourceMapContents = true;
        loaderOptions.cssLoader = {
            sourceMaps: true
        };
    }

    // Skip rendering index.html in test mode
    if (!TEST) {
        // Reference: https://github.com/ampedandwired/html-webpack-plugin
        // Render index.html
        config.plugins.push(
            new webpack.LoaderOptionsPlugin({
                options: loaderOptions
            }),
            new HtmlWebpackPlugin({
                template: './src/index.html',
                favicon: './src/images/mpdx-favicon.png',
                inject: 'body',
                minify: (BUILD ? {
                    html5: true
                } : false)
            }),
            new CopyWebpackPlugin([
                { from: 'assets' }
            ])
        );
    }

    // Add build specific plugins
    if (BUILD) {
        config.plugins.push(
            // Reference: http://webpack.github.io/docs/list-of-plugins.html#defineplugin
            // Create global constants which can be configured at compile time
            new webpack.DefinePlugin({
                'process.env': {
                    TRAVIS_COMMIT: JSON.stringify(process.env.TRAVIS_COMMIT)
                }
            }),

            // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
            // Only emit files when there are no errors
            new webpack.NoEmitOnErrorsPlugin(),

            // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
            // Minify all javascript, switch loaders to minimizing mode
            new webpack.optimize.UglifyJsPlugin()
        );
    }

    /**
     * Dev server configuration
     * Reference: http://webpack.github.io/docs/configuration.html#devserver
     * Reference: http://webpack.github.io/docs/webpack-dev-server.html
     */
    config.devServer = {
        contentBase: './public',
        stats: {
            modules: false,
            cached: false,
            colors: true,
            chunk: false
        },
        historyApiFallback: true,
        proxy: {
            '/api': {
                target: 'http://192.168.99.100:3000',
                secure: false
            }
        }
    };

    return config;
};
