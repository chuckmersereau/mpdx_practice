import concat from 'lodash/fp/concat';
import reduce from 'lodash/fp/reduce';
import reject from 'lodash/fp/reject';

class newsletterService {
    constructor(
        api, contacts, serverConstants, tools
    ) {
        this.api = api;
        this.contacts = contacts;
        this.tools = tools;

        this.loading = false;
        this.page = 1;
    }

    load(reset = false, page = 1) {
        if (!reset && this.data && this.page === page) {
            return Promise.resolve(this.data);
        }

        this.loading = true;
        this.page = page;

        return this.api.get(
            'contacts',
            {
                filter: {
                    account_list_id: this.api.account_list_id,
                    newsletter: 'no_value',
                    status: 'Partner - Financial,Partner - Special,Partner - Pray'
                },
                fields: {
                    contact: 'avatar,name,status,newsletter,addresses,primary_person'
                },
                include: 'addresses,people,people.email_addresses',
                sort: 'name',
                page: page,
                per_page: 10
            }
        ).then((data) => {
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

    setMeta(meta) {
        this.meta = meta;

        if (this.meta && this.meta.pagination && this.meta.pagination.total_count && this.tools.analytics) {
            this.tools.analytics['fix-send-newsletter'] = this.meta.pagination.total_count;
        }
    }

    save(contact) {
        return this.contacts.save({
            id: contact.id,
            send_newsletter: contact.send_newsletter
        }).then(() => {
            this.removeContactFromData(contact.id);
        });
    }

    removeContactFromData(contactId) {
        this.data = reject({ id: contactId }, this.data);
        if (this.meta && this.meta.pagination && this.meta.pagination.total_count) {
            this.meta.pagination.total_count -= 1;
            this.setMeta(this.meta);
        }
        if (this.data.length === 0) {
            this.load(true, this.page);
        }
    }

    bulkSave() {
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

import api from 'common/api/api.service';
import contacts from 'contacts/contacts.service';
import tools from 'tools/tools.service';

export default angular.module('mpdx.tools.fix.sendNewsletter.service', [
    api, contacts, tools
]).service('fixSendNewsletter', newsletterService).name;
