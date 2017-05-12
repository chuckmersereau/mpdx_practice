import component from './google.component';
import service from './google.service';
import integrations from './integrations/index.module';

export default angular.module('mpdx.preferences.integrations.google', [
    component,
    service,
    integrations
]).name;
