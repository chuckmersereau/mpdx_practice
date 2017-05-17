class AppealsController {
    constructor(
        $rootScope,
        appeals
    ) {
        this.appeals = appeals;
        this.$rootScope = $rootScope;
        this.count = 0;

        $rootScope.$on('accountListUpdated', () => {
            this.getCount();
        });
    }
    $onInit() {
        this.getCount();
    }
    getCount() {
        this.appeals.getCount().then((data) => {
            this.count = data;
        });
    }
}

const progressAppeals = {
    template: require('./appeals.html'),
    controller: AppealsController
};

export default angular.module('mpdx.home.progress.appeals', [])
    .component('progressAppeals', progressAppeals).name;
