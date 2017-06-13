import reject from 'lodash/fp/reject';
import uuid from 'uuid/v1';

class AlertsService {
    constructor(
        $timeout
    ) {
        this.$timeout = $timeout;
        this.data = [];
    }

    addAlert(message, type = 'success', status = null, displayTime = 5) {
        if (!message) { return; };

        const alert = {
            id: uuid(),
            displayTime: displayTime,
            message: message,
            status: status,
            type: type
        };

        this.data.push(alert);

        this.$timeout(() => {
            this.data = reject({ id: alert.id }, this.data);
        }, alert.displayTime * 1000);
    }
}

export default angular.module('mpdx.common.alerts.service', []
    ).service('alerts', AlertsService).name;
