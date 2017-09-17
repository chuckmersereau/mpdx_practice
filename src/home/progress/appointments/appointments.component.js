class AppointmentsController {
    constructor(
        accounts
    ) {
        this.accounts = accounts;
    }
}

const progressAppointments = {
    template: require('./appointments.html'),
    controller: AppointmentsController
};

import accounts from 'common/accounts/accounts.service';

export default angular.module('mpdx.home.progress.appointments', [
    accounts
]).component('progressAppointments', progressAppointments).name;
