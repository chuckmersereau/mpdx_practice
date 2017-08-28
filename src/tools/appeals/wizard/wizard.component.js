import concat from 'lodash/fp/concat';
import map from 'lodash/fp/map';
import joinComma from 'common/fp/joinComma';

class WizardController {
    constructor(
        $log, $q, $rootScope,
        api, contacts, contactsTags, serverConstants
    ) {
        this.$q = $q;
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.api = api;
        this.contacts = contacts;
        this.contactsTags = contactsTags;
        this.serverConstants = serverConstants;

        $rootScope.$on('accountListUpdated', () => {
            this.contactsTags.load();
            this.init();
        });
    }
    $onInit() {
        this.init();
    }
    init() {
        this.statuses = [];
        this.tags = [];
        this.excludes = [];
        this.newTags = [];
        this.appeal = {};
        this.saving = false;
        this.goal = {
            initial: 0,
            letterCost: 0,
            adminPercent: 12
        };

        this.calculateGoal();
    }
    calculateGoal() {
        const adminPercent = Number(this.goal.adminPercent) / 100 + 1;
        const initialGoal = Number(this.goal.initial);
        const letterCost = Number(this.goal.letterCost);
        this.appeal.amount = Math.round((initialGoal + letterCost) * adminPercent * 100) / 100;
    }
    selectAllStatuses() {
        if (this.statuses.length === this.serverConstants.data.status_hashes.length) {
            this.statuses = [];
        } else {
            this.statuses = map('id', this.serverConstants.data.status_hashes);
        }
    }
    selectAllTags() {
        if (this.tags.length === this.contactsTags.data.length) {
            this.tags = [];
        } else {
            this.tags = map('name', this.contactsTags.data);
        }
    }
    save(form = { // default for testing
        $setUntouched: () => {},
        $setPristine: () => {}
    }) {
        this.saving = true;
        return this.create(this.appeal).then((data) => {
            /* istanbul ignore next */
            this.$log.debug('appealAdded', data);
            this.saving = false;
            let promise = this.hasStatusesOrTags() ? this.getAndChangeContacts(data) : Promise.resolve();
            return promise.then(() => {
                form.$setUntouched();
                form.$setPristine();
                this.init();
            });
        }).catch((ex) => {
            this.saving = false;
            throw ex;
        });
    }
    hasStatusesOrTags() {
        return this.statuses.length > 0 || this.tags.length > 0;
    }
    getAndChangeContacts(appeal) {
        return this.api.get({
            url: 'contacts',
            data: {
                filter: {
                    account_list_id: this.api.account_list_id,
                    tags: this.tags,
                    status: this.statuses,
                    exclude: this.excludes,
                    any_tags: true
                },
                fields: {
                    contacts: 'tag_list'
                },
                per_page: 100 // limit of bulk api
            },
            overrideGetAsPost: true
        }).then((contacts) => {
            /* istanbul ignore next */
            this.$log.debug('contacts', contacts);
            let promises = [this.addContactsToAppeals(contacts, appeal)];
            if (this.newTags.length > 0) {
                promises.push(this.changeContacts(contacts, appeal));
            }
            return this.$q.all(promises);
        });
    }
    changeContacts(contacts, appeal) {
        const requests = map((contact) => {
            let patch = {
                id: contact.id,
                appeals: [appeal]
            };
            if (this.newTags.length > 0) {
                patch.tag_list = joinComma(concat(contact.tag_list, this.newTags));
            }
            return patch;
        }, contacts);
        this.$log.debug('batch contact', requests);
        return this.contacts.bulkSave(requests);
    }
    addContactsToAppeals(contacts, appeal) {
        const requests = map((contact) => {
            return {
                method: 'POST',
                path: `/api/v2/appeals/${appeal.id}/contacts/${contact.id}`
            };
        }, contacts);
        return this.api.post({
            url: 'batch',
            data: {
                requests: requests
            },
            doSerialization: false
        });
    }
    create(appeal) {
        appeal.account_list = { id: this.api.account_list_id };
        return this.api.post({
            url: 'appeals',
            data: appeal,
            include: 'excluded_appeal_contacts'
        });
    }
}

const AppealsWizard = {
    controller: WizardController,
    template: require('./wizard.html')
};

import contacts from 'contacts/contacts.service';
import contactTags from 'contacts/sidebar/filter/tags/tags.service';
import serverConstants from 'common/serverConstants/serverConstants.service';

export default angular.module('mpdx.tools.appeals.wizard.component', [
    contacts, contactTags, serverConstants
]).component('appealsWizard', AppealsWizard).name;
