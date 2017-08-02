class ContactReferralsController {
    constructor(
        $state, $stateParams,
        contacts, locale
    ) {
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.contacts = contacts;
        this.locale = locale;
    }
    openAddReferralsModal() {
        return this.contacts.openAddReferralsModal().then(() => {
            this.$state.go('contacts', { filters: { referrer: this.$stateParams.contactId } });
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

import uiRouter from '@uirouter/angularjs';
import contacts from 'contacts/contacts.service';
import locale from 'common/locale/locale.service';

export default angular.module('mpdx.contacts.show.referrals.component', [
    uiRouter,
    contacts, locale
]).component('contactReferrals', Referrals).name;
