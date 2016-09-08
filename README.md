# Angular 1.5 ES2015 WebPack + Babel workflow

[![Dependency Status](https://david-dm.org/mike-allison/angular-webpack-workflow/status.svg)](https://david-dm.org/mike-allison/angular-webpack-workflow#info=dependencies) [![devDependency Status](https://david-dm.org/mike-allison/angular-webpack-workflow/dev-status.svg)](https://david-dm.org/mike-allison/angular-webpack-workflow#info=devDependencies)

This workflow serves as a starting point for building Angular 1.5 applications using WebPack. 

## Features

* Heavily commented webpack configuration with reasonable defaults.
* ES6, and ES7 support with babel.js.
* Pre-configured CSS/Sass support (including bootstrap/fontawesome).
* NPM and Bower fallback support.
* Source maps included in all builds.
* Automatic dependency annotation.
* Development server with live reload.
* Production builds with cache busting and asset minification.
* Testing environment using karma to run tests and jasmine as the framework.
* Code coverage when tests are run.
* No gulp and no grunt, just npm run-scripts.

## Installation

To use it, just clone this repo and install the npm dependencies:

```shell
$ git clone https://github.com/mike-allison/angular-webpack-workflow my_app
$ cd my_app
$ npm install
```

## Scripts

All scripts are run with `npm run [script]`, for example: `npm run test`.

* `build` - generate a minified build to dist folder
* `start` - start development server, try it by opening `http://localhost:8080/`
* `test` - run all tests
* `test:live` - continuously run unit tests watching for changes

See what each script does by looking at the `scripts` section in [package.json](./package.json).

## Additional credits
Initial version was a direct fork of https://github.com/Foxandxss/angular-webpack-workflow