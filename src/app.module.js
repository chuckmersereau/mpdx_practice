import angular from 'angular';

import vendor from './vendor.module';
import home from './home/home.component';
import appConfig from './app.config';

export default angular.module('mpdx', [
	home,
	vendor
])
	.config(appConfig).name;

angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 250);