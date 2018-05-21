// import '!expose-loader?jQuery!jquery'; // import before angular to replace jqlite
import * as angular from 'angular';
import app from './app.directive';
import appConfig from './app.config';
import appRun from './app.run';
import bottom from './bottom/bottom.module';
import coaches from './coaches/coaches.module';
import common from './common/common.module';
import contacts from './contacts/contacts.module';
import home from './home/home.module';
import menu from './menu/menu.module';
import mobile from './mobile/mobile.component';
import preferences from './preferences/preferences.module';
import reports from './reports/reports.module';
import root from './root/root.component';
import setup from './setup/setup.module';
import tasks from './tasks/tasks.module';
import tools from './tools/tools.module';
import unavailable from './unavailable/unavailable.component';
import vendor from './vendor.module';

(window as any).angular = angular;

require('./app.scss');
require('./images/mpdx-favicon.png');

export default angular.module('mpdx', [
    app,
    bottom,
    coaches,
    common,
    contacts,
    home,
    menu,
    mobile,
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
