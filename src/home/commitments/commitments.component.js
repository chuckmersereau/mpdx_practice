class CommitmentsController {
    constructor(
        contactsService
    ) {
        this.contactsService = contactsService;

        this.noPledgeCount = null;
        this.lateContactCount = null;
    }
    $onInit() {
        console.error('home/commitments: endpoint not yet defined');
        // this.contactsService.getAnalytics().then((response) => {
        //     this.noPledgeCount = response;
        //     this.lateContactCount = response;
        // });
    }
}
const Commitments = {
    template: require('./commitments.html'),
    controller: CommitmentsController
};

export default angular.module('mpdx.home.commitments', [])
    .component('homeCommitments', Commitments)
    .name;