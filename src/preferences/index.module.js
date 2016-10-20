import accounts from './accounts/index.module';
import imports from './import/index.module';
import component from './preferences.component';

export default angular.module('mpdx.preferences', [
    accounts,
    imports,
    component
]).name;