class AlertsController {
    alerts;

    constructor(
        alerts
    ) {
        this.alerts = alerts;
    }

    $onInit() {
        this.modal = this.modal || false;
    }
}

const Alerts = {
    template: require('./alerts.html'),
    controller: AlertsController,
    bindings: {
        modal: '@'
    }
};

import alerts from './alerts.service';

export default angular.module('mpdx.common.alerts.component', [
    alerts
]).component('alerts', Alerts).name;
