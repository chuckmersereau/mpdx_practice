class CommitmentsController {
    contacts;

    constructor(
        contacts
    ) {
        this.contacts = contacts;
    }
}
const Commitments = {
    template: require('./commitments.html'),
    controller: CommitmentsController
};

export default angular.module('mpdx.home.commitments', [])
    .component('homeCommitments', Commitments)
    .name;