import deepBlur from 'angular-deep-blur';
import uiRouter from '@uirouter/angularjs';
import checklistModel from 'checklist-model';
import * as ngAnimate from 'angular-animate';
import ngInfiniteScroll from 'ng-infinite-scroll';
import ngCsv from 'ng-csv';
import * as ngSanitize from 'angular-sanitize';
import ngSortable from 'ng-sortable';
import angularticsGoogleAnalytics from 'angulartics-google-analytics';
import angularElastic from 'angular-elastic';
import ngClipboard from 'ngclipboard';
import * as Upload from 'ng-file-upload';
// deps with no default exports
import 'angulartics';
import 'angular-block-ui';
import 'angular-filter';
import 'angular-gettext';
import 'angular-jwt';
import 'angular-strap';
import 'angular-strap/dist/angular-strap.tpl';
import 'angular-strap/dist/modules/dimensions';
import 'angular-strap/dist/modules/debounce';
import 'angular-chosen-localytics';
import 'angular-localforage';
import 'angular-timeago';
import 'angularjs-toaster';
import 'ngmap';
import 'ng-tags-input';
import 'ng-rollbar';
// non-angular deps
import 'chart.js';
import 'chartjs-plugin-annotation';
import ngChartJs from 'angular-chart.js';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';

(window as any).moment = extendMoment(Moment);
import 'chosen-js';
import 'bootstrap-daterangepicker/daterangepicker';
import 'js-marker-clusterer';

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
