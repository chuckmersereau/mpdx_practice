class AppointmentsController {
    constructor() {
    }
}

const progressAppointments = {
    template: require('./appointments.html'),
    controller: AppointmentsController,
    bindings: {
        appointments: '<'
    }
};

export default angular.module('mpdx.home.progress.appointments', [])
    .component('progressAppointments', progressAppointments).name;
