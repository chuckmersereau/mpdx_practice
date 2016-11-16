class ContactReferralsController {
    referralsService;

    constructor(
        $state, referralsService
    ) {
        this.$state = $state;
        this.moment = moment;
        this.referralsService = referralsService;
    }
    $onChanges(changesObj) {
        if (changesObj.contact) {
            if (changesObj.contact.currentValue.id !== changesObj.contact.previousValue.id) {
                this.referralsService.fetchReferrals(changesObj.contact.currentValue.id);
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
