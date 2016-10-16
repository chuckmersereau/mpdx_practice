import angular from 'angular';

import app from './app.directive';
import common from './common/index.module';
import home from './home/home.component';
import login from './login/login.component';
import menu from './menu/menu.component';
import services from './services/index.module';
import vendor from './vendor.module';

import appConfig from './app.config';
import appRun from './app.run';

require('./app.scss');

export default angular.module('mpdx', [
    app,
    common,
    home,
    login,
    menu,
    services,
    vendor
])
    .config(appConfig)
    .run(appRun)
    .name;

angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 250);