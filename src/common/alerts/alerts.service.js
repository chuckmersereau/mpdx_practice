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
            duration: displayTime || 3,
            placement: 'top-right'
        });
    };
}

export default angular.module('mpdx.common.alerts.service', [])
    .service('alerts', AlertsService).name;