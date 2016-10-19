import accounts from './accounts/index.module';
import component from './preferences.component';

export default angular.module('mpdx.preferences', [
    accounts,
    component
]).name;