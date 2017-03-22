class CommitmentsController {
    contacts;

    constructor(
        $rootScope, contacts, blockUI
    ) {
        this.contacts = contacts;
        this.blockUI = blockUI.instances.get('commitments');
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
    load() {
        this.blockUI.start();
        this.contacts.getAnalytics(true).then(() => {
            this.blockUI.reset();
        });
    }
}
const Commitments = {
    template: require('./commitments.html'),
    controller: CommitmentsController
};

export default angular.module('mpdx.home.commitments', [])
    .component('homeCommitments', Commitments)
    .name;
