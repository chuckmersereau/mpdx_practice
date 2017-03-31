import find from 'lodash/fp/find';

class ContactReferralsController {
    moment;

    constructor(
        $state,
        contacts, locale
    ) {
        this.$state = $state;
        this.contacts = contacts;
        this.locale = locale;
    }
    getContact(id) {
        return find({id: id}, this.contacts.completeList);
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
