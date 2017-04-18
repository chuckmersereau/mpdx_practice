import find from 'lodash/fp/find';
import map from 'lodash/fp/map';
import uniqBy from 'lodash/fp/uniqBy';

class ContactReferralsController {
    contact;

    constructor(
        $state,
        contacts, locale
    ) {
        this.$state = $state;
        this.contacts = contacts;
        this.contactList = null;
        this.locale = locale;
    }
    $onInit() {
        const contactIds = map('id', uniqBy('id', this.contact.contacts_referred_by_me));
        if (contactIds.length < 1) {
            return;
        }
        this.contacts.getNames(contactIds).then((data) => {
            this.contactList = data;
        });
    }
    getContact(id) {
        return find({id: id}, this.contactList);
    }
    switchContact(id) {
        this.$state.go('contact', { contactId: id });
    }
}

const Referrals = {
    controller: ContactReferralsController,
    template: require('./referrals.html')
};

export default angular.module('mpdx.contacts.show.referrals.component', [])
    .component('contactReferrals', Referrals).name;
