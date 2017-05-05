import each from 'lodash/fp/each';
import map from 'lodash/fp/map';
import filter from 'lodash/fp/filter';

class MergeContacts {
    api;
    contacts;

    constructor(
        $log, $q, $rootScope,
        api, contacts
    ) {
        this.$q = $q;
        this.$log = $log;
        this.api = api;
        this.contacts = contacts;

        this.duplicates = [];
        this.perPage = 5;
        this.total = 0;

        $rootScope.$on('accountListUpdated', () => {
            this.load(true);
        });
    }

    load(reset = false) {
        if (!reset && this.duplicates.length !== 0) {
            return this.$q.resolve(this.duplicates);
        }

        return this.api.get('contacts/duplicates', {
            include: 'contacts,contacts.addresses',
            fields: {
                contacts: 'addresses,name,square_avatar,status,created_at',
                addresses: 'city,postal_code,primary_mailing_address,state,street,source'
            },
            filter: {account_list_id: this.api.account_list_id},
            per_page: this.perPage
        }).then((data) => {
            this.$log.debug('contacts/duplicates', data);
            this.total = data.meta.pagination.total_count;
            this.duplicates = map(duplicate => {
                duplicate.mergeChoice = -1;
                return duplicate;
            }, data);
        });
    }

    merge(duplicates) {
        const winnersAndLosers = map(duplicate => {
            if (duplicate.mergeChoice === 0) {
                return {winner_id: duplicate.contacts[0].id, loser_id: duplicate.contacts[1].id};
            }
            return {winner_id: duplicate.contacts[1].id, loser_id: duplicate.contacts[0].id};
        }, duplicates);
        return this.contacts.bulkMerge(winnersAndLosers);
    }

    ignore(duplicates) {
        let promises = [];
        each(duplicate => {
            promises.push(this.api.delete({url: `contacts/duplicates/${duplicate.id}`, type: 'contacts'}));
        }, duplicates);
        return this.$q.all(promises);
    }

    confirm(promises = []) {
        const contactsToMerge = filter(duplicate => (duplicate.mergeChoice === 0 || duplicate.mergeChoice === 1), this.duplicates);
        const contactsToIgnore = filter({mergeChoice: 2}, this.duplicates);
        if (contactsToMerge.length > 0) {
            promises.push(this.merge(contactsToMerge));
        }
        if (contactsToIgnore.length > 0) {
            promises.push(this.ignore(contactsToIgnore));
        }
        return this.$q.all(promises).then(() => this.load(true));
    }
}
export default angular.module('mpdx.tools.mergeContacts.service', [])
    .service('mergeContacts', MergeContacts).name;
