import component from './integrations.component';
import organization from './organization/index.module';
import service from './integrations.service';

export default angular.module('mpdx.preferences.integrations', [
    component,
    organization,
    service
]).name;