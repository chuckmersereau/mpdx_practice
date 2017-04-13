const reduce = require('lodash/fp/reduce').convert({ 'cap': false });
import each from 'lodash/fp/each';
import map from 'lodash/fp/map';
import reverse from 'lodash/fp/reverse';
import reject from 'lodash/fp/reject';

class CommitmentInfoService {
    api;

    constructor(
        $log, $q, $rootScope,
        api, contacts
    ) {
        this.$log = $log;
        this.$q = $q;
        this.api = api;
        this.contacts = contacts;
        this.loading = false;
        this.page = 1;

        $rootScope.$on('accountListUpdated', () => {
            this.load(true);
        });
    }

    load(reset = false, page = 1) {
        if (!reset && this.data && this.page === page) {
            return this.$q.resolve(this.data);
        }

        this.loading = true;
        this.page = page;

        return this.api.get({
            url: 'contacts',
            data: {
                filter: {status_valid: false},
                include: 'donor_accounts',
                page: page,
                per_page: 25
            }
        }).then((data) => {
            this.$log.debug('FixCommitmentInfo.load', data);

            this.data = data;
            this.meta = data.meta;

            let promises = [];

            each((contact) => {
                if (contact.suggested_changes['status']) {
                    contact.status = contact.suggested_changes['status'];
                }
                if (contact.suggested_changes['pledge_amount']) {
                    contact.pledge_amount = contact.suggested_changes['pledge_amount'];
                }
                if (contact.pledge_amount) {
                    contact.pledge_amount = parseFloat(contact.pledge_amount);
                }
                if (contact.suggested_changes['pledge_frequency']) {
                    contact.pledge_frequency = contact.suggested_changes['pledge_frequency'];
                }

                if (contact.donor_accounts && contact.donor_accounts.length > 0) {
                    const donorAccountId = map('id', contact.donor_accounts).join();

                    let params = {
                        filter: {
                            donor_account_id: donorAccountId
                        },
                        per_page: 6,
                        sort: '-created_at'
                    };

                    const donationPromise = this.api.get(`account_lists/${this.api.account_list_id}/donations`, params).then((data) => {
                        contact.donations = reverse(data);
                        this.$log.debug(`FixCommitmentInfo ${contact.name} donations`, contact.donations);
                    });

                    promises.push(donationPromise);
                }
            }, data);

            return this.$q.all(promises).then(() => {
                this.$log.debug('FixCommitmentInfo all donations received');

                this.loading = false;
            });
        });
    }

    save(contact) {
        contact.status_valid = true;

        return this.contacts.save(contact).then(() => {
            this.data = reject({ id: contact.id }, this.data);
            if (this.meta && this.meta.pagination && this.meta.pagination.total_count) {
                this.meta.pagination.total_count -= 1;
            }
        });
    }

    bulkSave() {
        let contacts = reduce((result, contact) => {
            contact.status_valid = true;
            return result;
        }, [], this.data);

        return this.contacts.bulkSave(contacts).then(() => {
            return this.load(true);
        });
    }
}

export default angular.module('mpdx.tools.fix.commitmentInfo.service', [])
    .service('fixCommitmentInfo', CommitmentInfoService).name;
