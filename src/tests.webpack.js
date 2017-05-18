// This file is an entry point for angular tests
// Avoids some weird issues when using webpack + angular.

import 'angular';
import 'angular-mocks/angular-mocks';
import 'angular-strap';
import 'angular-strap/dist/angular-strap.tpl';
import 'ng-rollbar';

//add es6 polyfill (mostly for promises) for phantomjs
require('es6-shim');
require('promise.prototype.finally');

//helpscout beacon
/*eslint-disable */
!function(e,o,n) {window.HSCW=o,window.HS=n,n.beacon=n.beacon||{};var t=n.beacon;t.userConfig={},t.readyQueue=[],t.config=function(e){this.userConfig=e},t.ready=function(e){this.readyQueue.push(e)},o.config={docs:{enabled:!0,baseUrl:"//mpdx.helpscoutdocs.com/"},contact:{enabled:!0,formId:"2388288c-07f9-11e7-b148-0ab63ef01522"}};var r=e.getElementsByTagName("script")[0],c=e.createElement("script");c.type="text/javascript",c.async=!0,c.src="https://djtflbt20bdde.cloudfront.net/",r.parentNode.insertBefore(c,r)}(document,window.HSCW||{},window.HS||{});
/*eslint-enable */

var testsContext = require.context(".", true, /.test$/);
testsContext.keys().forEach(testsContext);
