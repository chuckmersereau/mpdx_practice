import contacts, { ContactsService } from '../../contacts.service';
import locale, { LocaleService } from '../../../common/locale/locale.service';

class ContactReferralsController {
    referrals: any;
    constructor(
        private contacts: ContactsService,
        private locale: LocaleService
    ) {}
    $onInit() {
        return this.contacts.getReferrals(this.contacts.current.id).then((data) => {
            this.referrals = data;
        });
    }
    openAddReferralsModal() {
        return this.contacts.openAddReferralsModal();
    }
}

const Referrals = {
    controller: ContactReferralsController,
    template: require('./referrals.html')
};

export default angular.module('mpdx.contacts.show.referrals.component', [
    contacts, locale
]).component('contactReferrals', Referrals).name;
