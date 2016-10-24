import accounts from './accounts/index.module';
import component from './preferences.component';
import imports from './import/index.module';
import integrations from './integrations/index.module';
import notifications from './notifications/index.module';

export default angular.module('mpdx.preferences', [
    accounts,
    imports,
    integrations,
    component,
    notifications
]).name;