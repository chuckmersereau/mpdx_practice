class TimeZoneController {
    constructor(
        timeZone, users
    ) {
        this.timeZone = timeZone;
        this.users = users;

        this.saving = false;
    }
}

const TimeZone = {
    template: require('./timeZone.html'),
    controller: TimeZoneController
};

import timeZone from 'common/timeZone/timeZone.service';
import users from 'common/users/users.service';

export default angular.module('mpdx.preferences.personal.timeZone.component', [
    timeZone, users
]).component('preferencesPersonalTimeZone', TimeZone).name;
