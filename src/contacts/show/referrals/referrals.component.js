class ContactReferralsController {
    contactReferrals;
    moment;

    constructor(
        $state, contactReferrals
    ) {
        this.$state = $state;
        this.moment = moment;
        this.contactReferrals = contactReferrals;
    }
    $onChanges(changesObj) {
        if (changesObj.contact) {
            if (changesObj.contact.currentValue.id !== changesObj.contact.previousValue.id) {
                this.contactReferrals.fetchReferrals(changesObj.contact.currentValue.id);
            }
        }
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
