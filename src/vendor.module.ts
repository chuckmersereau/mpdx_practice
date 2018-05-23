import 'angular-block-ui';
import 'angular-chosen-localytics';
import 'angular-filter';
import 'angular-gettext';
import 'angular-jwt';
import 'angular-localforage';
import 'angular-strap';
import 'angular-strap/dist/angular-strap.tpl';
import 'angular-strap/dist/modules/debounce';
import 'angular-strap/dist/modules/dimensions';
import 'angular-timeago';
import 'angularjs-toaster';
import 'angulartics';
import 'bootstrap-daterangepicker/daterangepicker';
import 'chart.js';
import 'chartjs-plugin-annotation';
import 'chosen-js';
import 'js-marker-clusterer';
import 'ng-rollbar';
import 'ng-tags-input';
import 'ngmap';
import * as Moment from 'moment';
import * as ngAnimate from 'angular-animate';
import * as ngSanitize from 'angular-sanitize';
import * as Upload from 'ng-file-upload';
import { extendMoment } from 'moment-range';
import angularElastic from 'angular-elastic';
import angularticsGoogleAnalytics from 'angulartics-google-analytics';
import checklistModel from 'checklist-model';
import deepBlur from 'angular-deep-blur';
import ngChartJs from 'angular-chart.js';
import ngClipboard from 'ngclipboard';
import ngCsv from 'ng-csv';
import ngInfiniteScroll from 'ng-infinite-scroll';
import ngSortable from 'ng-sortable';
import uiRouter from '@uirouter/angularjs';

(window as any).moment = extendMoment(Moment);

// style deps
require('angular-block-ui/dist/angular-block-ui.css');

export default angular.module('mpdx.vendor', [
    deepBlur,
    'gettext',
    ngCsv,
    uiRouter,
    checklistModel,
    ngChartJs,
    ngAnimate,
    ngInfiniteScroll,
    ngSanitize,
    ngSortable,
    angularticsGoogleAnalytics,
    angularElastic,
    ngClipboard,
    Upload,
    'angulartics',
    'angular.filter',
    'angular-jwt',
    'blockUI',
    'LocalForageModule',
    'localytics.directives',
    'mgcrea.ngStrap',
    'mgcrea.ngStrap.helpers.dimensions',
    'mgcrea.ngStrap.helpers.debounce',
    'ngMap',
    'ngTagsInput',
    'yaru22.angular-timeago',
    'tandibar/ng-rollbar',
    'toaster'
]).name;
