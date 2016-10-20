import accounts from './accounts/index.module';
import imports from './import/index.module';
import integrations from './integrations/index.module';
import component from './preferences.component';

export default angular.module('mpdx.preferences', [
    accounts,
    imports,
    integrations,
    component
]).name;