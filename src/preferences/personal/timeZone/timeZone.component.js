class TimeZoneController {
    constructor(
        users
    ) {
        this.saving = false;
        this.users = users;
    }
}

const TimeZone = {
    template: require('./timeZone.html'),
    controller: TimeZoneController
};

export default angular.module('mpdx.preferences.personal.timeZone.component', [])
    .component('preferencesPersonalTimeZone', TimeZone).name;
