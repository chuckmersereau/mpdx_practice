class TimeZoneController {
    saving: boolean;
    constructor(
        private timeZone: TimeZoneService,
        private users: UsersService
    ) {
        this.saving = false;
    }
}

const TimeZone = {
    template: require('./timeZone.html'),
    controller: TimeZoneController
};

import timeZone, { TimeZoneService } from '../../../common/timeZone/timeZone.service';
import users, { UsersService } from '../../../common/users/users.service';

export default angular.module('mpdx.preferences.personal.timeZone.component', [
    timeZone, users
]).component('preferencesPersonalTimeZone', TimeZone).name;
