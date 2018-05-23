import { StateParams, StateService } from '@uirouter/core';
import contacts, { ContactsService } from '../../contacts.service';
import locale, { LocaleService } from '../../../common/locale/locale.service';
import uiRouter from '@uirouter/angularjs';

class ContactReferralsController {
    referrals: any;
    constructor(
        private $state: StateService,
        private $stateParams: StateParams,
        private contacts: ContactsService,
        private locale: LocaleService
    ) {}
    $onInit() {
        return this.contacts.getReferrals(this.contacts.current.id).then((data) => {
            this.referrals = data;
        });
    }
    openAddReferralsModal() {
        return this.contacts.openAddReferralsModal().then(() => {
            this.$state.go('contacts', { filters: { referrer: this.$stateParams.contactId } });
        });
    }
}

const Referrals = {
    controller: ContactReferralsController,
    template: require('./referrals.html')
};

export default angular.module('mpdx.contacts.show.referrals.component', [
    uiRouter,
    contacts, locale
]).component('contactReferrals', Referrals).name;
