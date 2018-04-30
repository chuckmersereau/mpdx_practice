// This file is an entry point for angular tests
// Avoids some weird issues when using webpack + angular.

// add es6 polyfill (mostly for promises) for phantomjs
require('es6-shim');

import 'angular';
import 'angular-mocks/angular-mocks';
import 'angular-strap';
import 'angular-strap/dist/angular-strap.tpl';
import 'ng-rollbar';

const testsContext = require.context('.', true, /.test$/);
testsContext.keys().forEach(testsContext);
