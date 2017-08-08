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

export default angular.module('mpdx.home.progress.appointments', [])
    .component('progressAppointments', progressAppointments).name;
