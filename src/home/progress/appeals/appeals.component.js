class AppealsController {
}

const progressAppeals = {
    template: require('./appeals.html'),
    controller: AppealsController
};

export default angular.module('mpdx.home.progress.appeals', [])
    .component('progressAppeals', progressAppeals).name;
