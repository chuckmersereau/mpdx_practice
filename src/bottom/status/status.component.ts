class StatusPageController {
    constructor(
        private statusPage: StatusPageService
    ) {
        this.statusPage = statusPage;
    }
}

const StatusPage = {
    controller: StatusPageController,
    template: require('./status.html')
};

import statusPage, { StatusPageService } from './status.service';

export default angular.module('mpdx.bottom.status.component', [
    statusPage
]).component('statusPage', StatusPage).name;
