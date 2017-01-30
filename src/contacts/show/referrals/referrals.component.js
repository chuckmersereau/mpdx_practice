class ContactReferralsController {
    moment;

    constructor(
        $state
    ) {
        this.$state = $state;
        this.moment = moment;
    }
    switchContact(id) {
        this.$state.go('contact', { contactId: id });
    }
}

const Referrals = {
    controller: ContactReferralsController,
    template: require('./referrals.html'),
    bindings: {
        contact: '<'
    }
};

export default angular.module('mpdx.contacts.show.referrals.component', [])
    .component('contactReferrals', Referrals).name;
