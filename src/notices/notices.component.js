class NoticesController {
    session;

    constructor(session) {
        this.session = session;
    }
}

const Notices = {
    template: require('./notices.html'),
    controller: NoticesController
};

export default angular.module('mpdx.notices.component', [])
    .component('notices', Notices).name;