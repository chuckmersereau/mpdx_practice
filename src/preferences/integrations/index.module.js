import component from './integrations.component';
import mailchimp from './mailchimp/index.module';
import organization from './organization/index.module';
import prayerLetters from './prayerLetters/prayerLetters.component';
import service from './integrations.service';

export default angular.module('mpdx.preferences.integrations', [
    component,
    mailchimp,
    organization,
    prayerLetters,
    service
]).name;