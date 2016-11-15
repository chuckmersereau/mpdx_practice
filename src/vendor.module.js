import deepBlur from 'angular-deep-blur';
import ngAnimate from 'angular-animate';
import getText from 'angular-gettext';
import jwt from 'angular-jwt';
import ngSanitize from 'angular-sanitize';
import uiRouter from 'angular-ui-router';
import checklistModel from 'checklist-model';
import ngInfiniteScroll from 'ng-infinite-scroll';
import ngCsv from 'ng-csv';
import ngFileUpload from 'ng-file-upload';
import ngMap from 'ngmap';
import ngSortable from 'ng-sortable';
// deps with no default exports
import 'angulartics';
import 'angulartics-google-analytics';
import 'angular-strap';
import 'angular-chosen-localytics';
import 'angular-localforage';
import uiBootstrap from 'angular-ui-bootstrap';
import 'angular-ui-bootstrap-datetimepicker';
import 'iso-currency';
import 'ng-tags-input';
//non-angular deps
import 'lodash';
import moment from 'moment';
window.moment = moment;
import 'moment-range';
import 'chosen-js';
import 'bootstrap-daterangepicker/daterangepicker';

// style deps
require('./styles/fonts/freightsanspro/stylesheet.css');


export default angular.module('mpdx.vendor', [
    deepBlur,
    getText,
    jwt,
    ngAnimate,
    ngSanitize,
    ngCsv,
    ngFileUpload,
    uiBootstrap,
    uiRouter,
    checklistModel,
    ngInfiniteScroll,
    ngMap,
    ngSortable,
    'angulartics',
    'angulartics.google.analytics',
    'isoCurrency',
    'LocalForageModule',
    'localytics.directives',
    'mgcrea.ngStrap',
    'ngTagsInput',
    'ui.bootstrap.datetimepicker'
]).name;
