class AlertsService {
    constructor($timeout) {
        this.$timeout = $timeout;

        this.alerts = [];
        this.timeout = null;
    }
    removeAlert(alert) {
        var index = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
    };

    addAlert(message, type, displayTime) {
        this.alerts = [];
        displayTime = angular.isDefined(displayTime) ? displayTime : 5000;
        var alert = { message: message, type: 'alert-' + type };
        this.alerts.push(alert);
        if (this.timeout !== null) {
            this.$timeout.cancel(this.timeout);
        }
        this.timeout = this.$timeout(() => { this.removeAlert(alert); }, displayTime);
    };
}

export default angular.module('mpdx.common.alerts.service', [])
    .service('alerts', AlertsService).name;