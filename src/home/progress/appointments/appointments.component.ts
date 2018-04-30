class AppointmentsController {
    constructor(
        private accounts: AccountsService
    ) {}
}

const progressAppointments = {
    template: require('./appointments.html'),
    controller: AppointmentsController
};

import accounts, { AccountsService } from '../../../common/accounts/accounts.service';

export default angular.module('mpdx.home.progress.appointments', [
    accounts
]).component('progressAppointments', progressAppointments).name;
