import accounts, { AccountsService } from '../../../common/accounts/accounts.service';

class AppointmentsController {
    constructor(
        private accounts: AccountsService
    ) {}
}

const progressAppointments = {
    template: require('./appointments.html'),
    controller: AppointmentsController
};

export default angular.module('mpdx.home.progress.appointments', [
    accounts
]).component('progressAppointments', progressAppointments).name;
