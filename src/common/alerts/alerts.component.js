class AlertsController {
    alerts;

    constructor(
        alerts
    ) {
        this.alerts = alerts;
    }
}

const Alerts = {
    template: require('./alerts.html'),
    controller: AlertsController
};

import alerts from './alerts.service';

export default angular.module('mpdx.common.alerts.component', [
    alerts
]).component('alerts', Alerts).name;
