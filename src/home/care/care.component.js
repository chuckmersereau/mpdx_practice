class CareController {
    tasks;

    constructor(
        $rootScope, tasks, blockUI
    ) {
        this.tasks = tasks;
        this.blockUI = blockUI.instances.get('care');
        this.watcher = $rootScope.$on('accountListUpdated', () => {
            this.load();
        });
    }
    $onInit() {
        this.load();
    }
    $onDestroy() {
        this.watcher();
    }
    addNewsletter() {
        this.tasks.newsletterModal().then(() => this.load());
    }
    load() {
        this.blockUI.start();
        this.tasks.getAnalytics(true).then(() => {
            this.blockUI.reset();
        });
    }
}
const Care = {
    template: require('./care.html'),
    controller: CareController
};

export default angular.module('mpdx.home.care.component', [])
    .component('homeCare', Care)
    .name;
