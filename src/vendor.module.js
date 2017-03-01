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
import lang from 'langmap'; //load before language-picker
window.languageMappingList = lang;
import 'angular-block-ui';
import 'angular-filter';
import 'angular-strap';
import 'angular-strap/dist/angular-strap.tpl';
import 'angular-chosen-localytics';
import 'angular-localforage';
import 'angular-timeago';
import 'iso-currency';
import 'ng-tags-input';
//non-angular deps
import 'lodash';
import 'lodash/fp';
import moment from 'moment';
window.moment = moment;
import 'moment-range';
import 'chosen-js';
import 'bootstrap-daterangepicker/daterangepicker';

// style deps
require('./styles/fonts/freightsanspro/stylesheet.css');
require('./styles/fonts/cru/ci.css');
require('angular-block-ui/dist/angular-block-ui.css');


export default angular.module('mpdx.vendor', [
    deepBlur,
    getText,
    jwt,
    ngAnimate,
    ngSanitize,
    ngCsv,
    ngFileUpload,
    uiRouter,
    checklistModel,
    ngInfiniteScroll,
    ngMap,
    ngSortable,
    'angulartics',
    'angulartics.google.analytics',
    'angular.filter',
    'blockUI',
    'isoCurrency',
    'LocalForageModule',
    'localytics.directives',
    'mgcrea.ngStrap',
    'ngTagsInput',
    'yaru22.angular-timeago'
]).name;
