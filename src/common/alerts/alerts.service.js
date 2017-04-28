class AlertsService {
    data;

    constructor(
        $alert
    ) {
        this.$alert = $alert;
    }


    addAlert(message, type, displayTime) {
        this.$alert({
            content: message,
            type: type || 'success',
            duration: displayTime || 5,
            placement: 'top-right'
        });
    };
}

export default angular.module('mpdx.common.alerts.service', [
    'mgcrea.ngStrap'
])
    .service('alerts', AlertsService).name;