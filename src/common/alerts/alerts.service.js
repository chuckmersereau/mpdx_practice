class AlertsService {
    data;

    constructor($timeout) {
        this.$timeout = $timeout;

        this.data = [];
        this.timeout = null;
    }
    removeAlert(alert) {
        const index = this.data.indexOf(alert);
        this.data.splice(index, 1);
    };

    addAlert(message, type, displayTime) {
        this.data = [];
        displayTime = angular.isDefined(displayTime) ? displayTime : 5000;
        const alert = {message: message, type: 'alert-' + type};
        this.data.push(alert);
        if (this.timeout !== null) {
            this.$timeout.cancel(this.timeout);
        }
        this.timeout = this.$timeout(() => { this.removeAlert(alert); }, displayTime);
    };
}

export default angular.module('mpdx.common.alerts.service', [])
    .service('alerts', AlertsService).name;