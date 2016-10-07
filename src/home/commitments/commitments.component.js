class CommitmentsController {
    constructor(currentAccountList) {
        this.currentAccountList = currentAccountList;

        this.noPledgeCount = null;
        this.lateContactCount = null;
    }
    $onInit() {
        this.currentAccountList.contacts.getLatePledgeCount().then((response) => {
            this.noPledgeCount = response.data;
        });
        this.currentAccountList.contacts.getLatePledgeDays().then((response) => {
            this.lateContactCount = response.data;
        });
    }
}
const Commitments = {
    template: require('./commitments.html'),
    controller: CommitmentsController
};

export default angular.module('mpdx.home.commitments', [])
    .component('home-commitments', Commitments)
    .name;