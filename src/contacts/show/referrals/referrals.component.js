class ContactReferralsController {
    constructor(
        $stateParams,
        contacts, locale
    ) {
        this.$stateParams = $stateParams;
        this.contacts = contacts;
        this.locale = locale;
    }
    openAddReferralsModal() {
        this.contacts.openAddReferralsModal().then(() => {
            this.contacts.getReferrals(this.$stateParams.contactId).then((data) => {
                this.referrals = data;
            });
        });
    }
}

const Referrals = {
    controller: ContactReferralsController,
    template: require('./referrals.html'),
    bindings: {
        referrals: '<'
    }
};

export default angular.module('mpdx.contacts.show.referrals.component', [])
    .component('contactReferrals', Referrals).name;
