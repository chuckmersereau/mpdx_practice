import deepBlur from 'angular-deep-blur';
import ngAnimate from 'angular-animate';
import getText from 'angular-gettext';
import jwt from 'angular-jwt';
import ngSanitize from 'angular-sanitize';
import uiRouter from '@uirouter/angularjs';
import checklistModel from 'checklist-model';
import ngInfiniteScroll from 'ng-infinite-scroll';
import ngCsv from 'ng-csv';
import ngFileUpload from 'ng-file-upload';
import ngMap from 'ngmap';
import ngSortable from 'ng-sortable';
import angulartics from 'angulartics';
import angularticsGoogleAnalytics from 'angulartics-google-analytics';
import angularElastic from 'angular-elastic';
import ngClipboard from 'ngclipboard';
// deps with no default exports
import 'angular-block-ui';
import 'angular-filter';
import 'angular-strap';
import 'angular-strap/dist/angular-strap.tpl';
import 'angular-strap/dist/modules/dimensions';
import 'angular-strap/dist/modules/debounce';
import 'angular-chosen-localytics';
import 'angular-localforage';
import 'angular-timeago';
import 'ng-tags-input';
import 'ng-rollbar';
// non-angular deps
import 'chart.js';
import 'chartjs-plugin-annotation';
import ngChartJs from 'angular-chart.js';
import Moment from 'moment';
import { extendMoment } from 'moment-range';

window.moment = extendMoment(Moment);
import 'chosen-js';
import 'bootstrap-daterangepicker/daterangepicker';
import 'js-marker-clusterer';

// style deps
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
    ngChartJs,
    ngInfiniteScroll,
    ngMap,
    ngSortable,
    angulartics,
    angularticsGoogleAnalytics,
    angularElastic,
    ngClipboard,
    'angular.filter',
    'blockUI',
    'LocalForageModule',
    'localytics.directives',
    'mgcrea.ngStrap',
    'mgcrea.ngStrap.helpers.dimensions',
    'mgcrea.ngStrap.helpers.debounce',
    'ngTagsInput',
    'yaru22.angular-timeago',
    'tandibar/ng-rollbar'
]).name;
