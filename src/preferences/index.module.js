import accounts from './accounts/index.module';
import admin from './admin/index.module';
import coaches from './coaches/index.module';
import component from './preferences.component';
import integrations from './integrations/index.module';
import notifications from './notifications/notifications.component';
import personal from './personal/index.module';
import sidebar from './sidebar/sidebar.component';


export default angular.module('mpdx.preferences', [
    accounts,
    admin,
    coaches,
    integrations,
    component,
    notifications,
    personal,
    sidebar
]).name;
