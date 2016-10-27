import angular from 'angular';

import app from './app.directive';
import common from './common/index.module';
import contacts from './contacts/index.module';
import bottom from './bottom/index.module';
import home from './home/index.module';
import menu from './menu/menu.component';
import preferences from './preferences/index.module';
import services from './services/index.module';
import tasks from './tasks/index.module';
import vendor from './vendor.module';

import appConfig from './app.config';
import appRun from './app.run';

require('./app.scss');

export default angular.module('mpdx', [
    app,
    bottom,
    common,
    contacts,
    home,
    menu,
    preferences,
    services,
    tasks,
    vendor
])
    .config(appConfig)
    .run(appRun)
    .name;

angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 250);
