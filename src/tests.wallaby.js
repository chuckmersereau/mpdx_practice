// This file is an entry point for angular tests
// Avoids some weird issues when using webpack + angular.

import 'angular';
import 'angular-mocks/angular-mocks';
import 'angular-strap';
import 'angular-strap/dist/angular-strap.tpl';
import 'ng-rollbar';

//add promise polyfill for karma
require('es6-shim');