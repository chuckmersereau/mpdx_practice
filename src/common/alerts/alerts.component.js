class AlertsController {
    constructor(
        alerts
    ) {
        this.alerts = alerts;
    }

    $onInit() {
        this.modal = this.modal || false;
        this.paddingOnly = this.paddingOnly || false;
    }
}

const Alerts = {
    template: require('./alerts.html'),
    controller: AlertsController,
    bindings: {
        modal: '@',
        paddingOnly: '@'
    }
};

import alerts from './alerts.service';

export default angular.module('mpdx.common.alerts.component', [
    alerts
]).component('alerts', Alerts).name;
