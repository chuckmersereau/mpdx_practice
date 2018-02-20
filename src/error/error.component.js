import { pull } from 'lodash/fp';

class ErrorController {
    constructor(
        $window,
        api, session
    ) {
        this.$window = $window;
        this.api = api;
        this.session = session;
    }
    cancel(error) {
        this.session.errors = pull(error, this.session.errors);
        if (error.promise) {
            error.promise.reject();
        }
    }
    retry(error) {
        this.session.errors = pull(error, this.session.errors);
        error.promise = this.api.call(error.request);
    }
    reload() {
        this.$window.location.reload(true);
    }
    moreDetails(error) {
        error.moreDetails = true;
    }
}

const Error = {
    template: require('./error.html'),
    controller: ErrorController
};

export default angular.module('mpdx.error.component', [])
    .component('error', Error).name;