import component from './setup.component';
import connect from './connect/connect.component';
import merge from './merge/merge.component';
import notifications from './notifications/notifications.component';
import preferences from './preferences/preferences.component';
import start from './start/start.component';

export default angular.module('mpdx.setup', [
    component,
    connect,
    merge,
    notifications,
    preferences,
    start
]).name;