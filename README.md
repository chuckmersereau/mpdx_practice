# MPDX angular front-end

## Features

* Webpack 2
* ES2016 support with babel.
* Pre-configured CSS/Sass support (including bootstrap/fontawesome).
* NPM & Yarn support
* Bower and vendor module fallback support.
* Automatic dependency annotation.
* Development server with hot reload.
* Production builds with cache busting and asset minification.
* Testing environment using karma to run tests and jasmine as the framework.

## Installation

To use it, just clone this repo and install the npm dependencies:

```shell
$ git clone https://github.com/CruGlobal/mpdx_web
$ cd mpdx_web
$ npm install
```

## Scripts

All scripts are run with `npm run [script]`, for example: `npm run test`.

* `build` - generate a minified build to dist folder
* `start` - start development server, try it by opening `http://localhost:8080/`
* `test` - run all tests
* `test:live` - continuously run unit tests watching for changes

## Additional credits
Initial version was a direct fork of https://github.com/mike-allison/angular-webpack-workflow