class CommitmentsController {
    constructor(currentAccountList) {
        this.currentAccountList = currentAccountList;

        this.noPledgeCount = null;
        this.lateContactCount = null;
    }
    $onInit() {
        this.currentAccountList.contacts.getLatePledgeCount().then((response) => {
            this.noPledgeCount = response;
        });
        this.currentAccountList.contacts.getLatePledgeDays().then((response) => {
            this.lateContactCount = response;
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