import angular from 'angular';

import common from './common/index.module';
import home from './home/home.component';
import login from './login/login.component';
import vendor from './vendor.module';

import appConfig from './app.config';

export default angular.module('mpdx', [
    common,
    home,
    login,
    vendor
])
    .config(appConfig).name;

angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 250);