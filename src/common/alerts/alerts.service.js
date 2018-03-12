class AlertsService {
    constructor(
        $q, toaster
    ) {
        this.$q = $q;
        this.toaster = toaster;
    }
    addAlert(message, type = 'success', displayTime = 1.5, retryable = false) {
        if (!message) { return; }
        let promise = this.$q.defer();
        type = type === 'danger' ? 'error' : type; // fix for angularjs-toaster

        this.toaster.pop({
            type: type,
            body: 'alert-template',
            bodyOutputType: 'directive',
            directiveData: {
                error: message,
                retryable: retryable,
                type: type
            },
            timeout: displayTime * 1000,
            showCloseButton: true,
            clickHandler: (toast, isCloseButton) => {
                if (!isCloseButton) {
                    promise.resolve();
                }
                return true;
            },
            onHideCallback: () => {
                promise.reject();
            }
        });
        return promise.promise;
    }
}

import 'angularjs-toaster';

export default angular.module('mpdx.common.alerts.service', ['toaster'])
    .service('alerts', AlertsService).name;
