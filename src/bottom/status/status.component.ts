import statusPage, { StatusPageService } from './status.service';

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

export default angular.module('mpdx.bottom.status.component', [
    statusPage
]).component('statusPage', StatusPage).name;
