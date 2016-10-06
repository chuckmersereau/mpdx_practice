import deepBlur from 'angular-deep-blur';
import ngAnimate from 'angular-animate';
import ngSanitize from 'angular-sanitize';
import uiBootstrap from 'angular-ui-bootstrap';
import uiRouter from 'angular-ui-router';
import checklistModel from 'checklist-model';
import ngInfiniteScroll from 'ng-infinite-scroll';
import ngCsv from 'ng-csv'
import ngMap from 'ngmap';
import ngSortable from 'ng-sortable'
// deps with no default exports
import 'angular-strap';
import 'angular-chosen-localytics';
import 'angular-localforage';
import 'angular-ui-bootstrap-datetimepicker';
import 'iso-currency';
import 'ng-tags-input';


export default angular.module('mpdx.vendor', [
	deepBlur,
	ngAnimate,
	ngSanitize,
	ngCsv,
	uiBootstrap,
	uiRouter,
	checklistModel,
	ngInfiniteScroll,
	ngMap,
	ngSortable,
	'isoCurrency',
	'LocalForageModule',
	'localytics.directives',
	'mgcrea.ngStrap',
	'ngTagsInput',
	'ui.bootstrap.datetimepicker',
]).name