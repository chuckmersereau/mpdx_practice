import accounts from './accounts/index.module';
import component from './preferences.component';
import contacts from './contacts/contacts.service';
import imports from './import/index.module';
import integrations from './integrations/index.module';
import notifications from './notifications/index.module';
import personal from './personal/personal.component';
import sidebar from './sidebar/sidebar.component';


export default angular.module('mpdx.preferences', [
    accounts,
    imports,
    integrations,
    component,
    contacts,
    notifications,
    personal,
    sidebar
]).name;