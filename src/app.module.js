import jQuery from '!expose-loader?jQuery!jquery'; //import before angular to replace jqlite
window.$ = jQuery;
import angular from 'angular';
window.angular = angular;

import app from './app.directive';
import admin from './admin/admin.component';
import bottom from './bottom/index.module';
import common from './common/index.module';
import contacts from './contacts/index.module';
import home from './home/index.module';
import menu from './menu/index.module';
import preferences from './preferences/index.module';
import reports from './reports/index.module';
import root from './root/root.component';
import setup from './setup/index.module';
import tasks from './tasks/index.module';
import tools from './tools/index.module';
import unavailable from './unavailable/index.module';
import vendor from './vendor.module';
import appConfig from './app.config';
import appRun from './app.run';

require('./app.scss');
require('./images/mpdx-favicon.png');

export default angular.module('mpdx', [
    app,
    admin,
    bottom,
    common,
    contacts,
    home,
    menu,
    preferences,
    reports,
    root,
    setup,
    tasks,
    tools,
    unavailable,
    vendor
])
    .config(appConfig)
    .run(appRun)
    .value('layoutSettings', {
        fullWidth: false
    })
    .name;

angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 500);
