class AppealsController {
    constructor(
        $rootScope, appeals
    ) {
        this.appeals = appeals;
        this.$rootScope = $rootScope;
        this.count = 0;
        this.appeals.getList();
    }
}

const progressAppeals = {
    template: require('./appeals.html'),
    controller: AppealsController
};

export default angular.module('mpdx.home.progress.appeals', [])
    .component('progressAppeals', progressAppeals).name;
