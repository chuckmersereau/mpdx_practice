import component from './integrations.component';
import google from './google/google.component';
import googleIntegrations from './google/integrations/integrations.controller';
import mailchimp from './mailchimp/mailchimp.component';
import organization from './organization/organization.component';
import prayerLetters from './prayerLetters/prayerLetters.component';

export default angular.module('mpdx.preferences.integrations', [
    component,
    google,
    googleIntegrations,
    mailchimp,
    organization,
    prayerLetters
]).name;
