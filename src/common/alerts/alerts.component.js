class AlertsController {
    constructor(alertsService) {
        this.alertsService = alertsService;
    }
}

const Alerts = {
    controller: AlertsController,
    template: require('./alerts.html')
};

export default angular.module('mpdx.common.alerts', [])
    .component('alerts', Alerts).name;
