import accounts from './accounts/accounts.module';
import admin from './admin/admin.module';
import coaches from './coaches/coaches.module';
import component from './preferences.component';
import integrations from './integrations/integrations.module';
import notifications from './notifications/notifications.component';
import personal from './personal/personal.module';
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
