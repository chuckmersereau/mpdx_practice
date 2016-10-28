import accounts from './accounts/index.module';
import component from './preferences.component';
import imports from './import/index.module';
import integrations from './integrations/index.module';
import notifications from './notifications/index.module';
import personal from './personal/index.module';
import sidebar from './sidebar/sidebar.component';

export default angular.module('mpdx.preferences', [
    accounts,
    imports,
    integrations,
    component,
    notifications,
    personal,
    sidebar
]).name;