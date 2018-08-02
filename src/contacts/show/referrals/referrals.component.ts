import { assign, defaultTo, find, get, map } from 'lodash/fp';
import api, { ApiService } from '../../../common/api/api.service';
import contacts, { ContactsService } from '../../contacts.service';
import locale, { LocaleService } from '../../../common/locale/locale.service';

class ContactReferralsController {
    referrals: any;
    constructor(
        private $log: ng.ILogService,
        private api: ApiService,
        private contacts: ContactsService,
        private locale: LocaleService // needed in view
    ) {}
    $onInit() {
        this.getReferrals(this.contacts.current.id);
    }
    getReferrals(id: string): ng.IPromise<any> {
        return this.api.get({
            url: `contacts/${id}`,
            data: {
                include: 'contacts_referred_by_me',
                fields: {
                    contacts: 'contacts_referred_by_me,name,created_at'
                }
            },
            doDeSerialization: false
        }).then((data: any) => {
            data = this.deserialize(data);
            /* istanbul ignore next */
            this.$log.debug('referrals by contact', id, data);
            this.referrals = data;
        });
    }
    private deserialize(data: any): any[] {
        const referralData = defaultTo([], get('data', get('contacts_referred_by_me', data.data.relationships)));
        const referralIds = map('id', referralData);
        return map((id) => {
            const contact = find({ id: id }, data.included);
            return assign(get('attributes', contact), { id: id });
        }, referralIds);
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
    api, contacts, locale
]).component('contactReferrals', Referrals).name;
