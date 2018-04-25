# MPDX angular front-end

## Features

* Webpack 2
* ES2016 support with babel.
* Pre-configured CSS/Sass support (including bootstrap/fontawesome).
* NPM & Yarn support
* Bower and vendor module fallback support.
* Automatic angular dependency injection annotation.
* Development server with hot reload.
* Production builds with cache busting and asset minification.
* Testing environment using karma to run tests and jasmine as the framework.
* In-development testing/coverage using wallabyjs.

## Installation

To use it, just clone this repo and install the dependencies:

```shell
$ git clone https://github.com/CruGlobal/mpdx_web
$ cd mpdx_web
$ npm install -g yarn
$ yarn install
```

## Scripts

All scripts are run with `yarn [script]`, for example: `yarn test`.

* `build` - generate a minified build to dist folder
* `start` - start development server, try it by opening `http://localhost:8080/`
* `test` - run all tests
* `test:live` - continuously run unit tests watching for changes

## Commonly used libraries

#### Lodash FP: https://github.com/lodash/lodash/wiki/FP-Guide
https://simonsmith.io/dipping-a-toe-into-functional-js-with-lodash-fp/
https://gist.github.com/jfmengels/6b973b69c491375117dc
#### UI-Router: https://ui-router.github.io/ng1/
https://ui-router.github.io/guide/ng1/migrate-to-1_0


## Additional credits
Initial version was a direct fork of https://github.com/mike-allison/angular-webpack-workflow

## apple-app-site-association
This file has been uploaded directly to S3. To make changes to this you need to login to the AWS S3 Management Console and update the file in the bucket directly.
