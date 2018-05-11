import { concat, reduce, reject } from 'lodash/fp';
import api, { ApiService } from '../../../common/api/api.service';
import contacts, { ContactsService } from '../../../contacts/contacts.service';
import tools, { ToolsService } from '../../tools.service';

export class FixSendNewsletterService {
    data: any;
    loading: boolean;
    meta: any;
    page: number;
    constructor(
        private $q: ng.IQService,
        private api: ApiService,
        private contacts: ContactsService,
        private tools: ToolsService
    ) {
        this.loading = false;
        this.page = 1;
    }
    load(reset: boolean = false, page: number = 1): ng.IPromise<any> {
        if (!reset && this.data && this.page === page) {
            return this.$q.resolve(this.data);
        }

        this.loading = true;
        this.page = page;

        return this.api.get(
            'contacts',
            {
                filter: {
                    account_list_id: this.api.account_list_id,
                    newsletter: 'no_value',
                    status: 'Partner - Financial,Partner - Special,Partner - Pray',
                    deceased: false
                },
                fields: {
                    contact: 'avatar,name,status,newsletter,addresses,primary_person'
                },
                include: 'addresses,people,people.email_addresses',
                sort: 'name',
                page: page,
                per_page: 10
            }
        ).then((data: any) => {
            this.setMeta(data.meta);

            this.data = reduce((result, contact) => {
                contact.addresses = reject({ primary_mailing_address: false }, contact.addresses);
                if (!contact.send_newsletter) {
                    if (contact.addresses.length > 0) {
                        contact.send_newsletter = 'Physical';
                    }
                    if (contact.primary_person) {
                        if (contact.primary_person.optout_enewsletter !== true) {
                            const PrimaryEmailAddresses = reject({ primary: false },
                                contact.primary_person.email_addresses);
                            if (PrimaryEmailAddresses.length > 0) {
                                if (contact.send_newsletter === 'Physical') {
                                    contact.send_newsletter = 'Both';
                                } else {
                                    contact.send_newsletter = 'Email';
                                }
                            }
                        }
                    }
                    if (!contact.send_newsletter) {
                        contact.send_newsletter = 'None';
                    }
                }
                return concat(result, contact);
            }, [], angular.copy(data));

            this.loading = false;

            return this.data;
        });
    }
    private setMeta(meta: any): void {
        this.meta = meta;

        if (this.meta && this.meta.pagination && this.meta.pagination.total_count >= 0 && this.tools.analytics) {
            this.tools.analytics['fix-send-newsletter'] = this.meta.pagination.total_count;
        }
    }
    save(contact: any): ng.IPromise<void> {
        return this.contacts.save({
            id: contact.id,
            send_newsletter: contact.send_newsletter
        }).then(() => {
            this.removeContactFromData(contact.id);
        });
    }
    private removeContactFromData(contactId: string): void {
        this.data = reject({ id: contactId }, this.data);
        if (this.meta && this.meta.pagination && this.meta.pagination.total_count) {
            this.meta.pagination.total_count -= 1;
            this.setMeta(this.meta);
        }
        if (this.data.length === 0) {
            this.load(true, this.page);
        }
    }
    bulkSave(): ng.IPromise<any> {
        let contacts = reduce((result, contact) => {
            if (!contact.send_newsletter) {
                return result;
            }
            result.push({
                id: contact.id,
                send_newsletter: contact.send_newsletter
            });
            return result;
        }, [], this.data);

        this.loading = true;
        return this.contacts.bulkSave(contacts).then(() => {
            this.loading = false;
            return this.load(true);
        });
    }
}

export default angular.module('mpdx.tools.fix.sendNewsletter.service', [
    api, contacts, tools
]).service('fixSendNewsletter', FixSendNewsletterService).name;
