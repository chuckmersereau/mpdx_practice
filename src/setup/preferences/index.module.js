import component from './preferences.component';
import accounts from './accounts/accounts.component';
import integrations from './integrations/integrations.component';
import notifications from './notifications/notifications.component';
import personal from './personal/personal.component';

export default angular.module('mpdx.setup.preferences', [
    component,
    accounts,
    integrations,
    notifications,
    personal
]).name;
