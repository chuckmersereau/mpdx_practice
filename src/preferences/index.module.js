import accounts from './accounts/index.module';
import component from './preferences.component';
import integrations from './integrations/index.module';
import notifications from './notifications/index.module';
import personal from './personal/index.module';
import sidebar from './sidebar/sidebar.component';


export default angular.module('mpdx.preferences', [
    accounts,
    integrations,
    component,
    notifications,
    personal,
    sidebar
]).name;