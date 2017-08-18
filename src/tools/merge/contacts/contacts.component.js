import filter from 'lodash/fp/filter';
import map from 'lodash/fp/map';

class MergeContactsController {
    constructor(
        $log, $rootScope,
        $state, blockUI, gettextCatalog,
        alerts, api, contacts, tools
    ) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.$state = $state;
        this.gettextCatalog = gettextCatalog;
        this.blockUI = blockUI.instances.get('merge-contacts');
        this.alerts = alerts;
        this.api = api;
        this.contacts = contacts;
        this.tools = tools;

        this.duplicates = [];
        this.total = 0;
    }

    $onInit() {
        this.$rootScope.$on('accountListUpdated', () => {
            this.load();
        });

        this.load();
    }

    select(duplicate, index) {
        duplicate.ignored = false;
        duplicate.contacts[0].selected = index === 0;
        duplicate.contacts[1].selected = index === 1;
    }

    deSelect(duplicate) {
        duplicate.ignored = true;
        duplicate.contacts[0].selected = false;
        duplicate.contacts[1].selected = false;
    }

    confirm() {
        this.blockUI.start();
        let promises = [];
        const contactsToMerge = filter(duplicate => !duplicate.ignored, this.duplicates);
        const contactsToIgnore = filter({ ignored: true }, this.duplicates);
        if (contactsToMerge.length > 0) {
            promises.push(this.merge(contactsToMerge));
        }
        promises.push(...this.ignore(contactsToIgnore));
        return Promise.all(promises).then(() => {
            this.alerts.addAlert(this.gettextCatalog.getString('Contacts successfully merged'));
        });
    }

    confirmAndContinue() {
        return this.confirm().then(() => {
            return this.load().then(() => {
                this.blockUI.reset();
            });
        });
    }

    confirmThenLeave() {
        return this.confirm().then(() => {
            this.blockUI.reset();
            this.$state.go('tools');
        });
    }

    ignore(duplicates) {
        return map(duplicate =>
            this.api.delete({ url: `contacts/duplicates/${duplicate.id}`, type: 'contacts' })
            , duplicates);
    }

    merge(duplicates) {
        const winnersAndLosers = map(duplicate => {
            if (duplicate.contacts[0].selected) {
                return { winner_id: duplicate.contacts[0].id, loser_id: duplicate.contacts[1].id };
            }
            return { winner_id: duplicate.contacts[1].id, loser_id: duplicate.contacts[0].id };
        }, duplicates);
        return this.contacts.merge(winnersAndLosers);
    }

    load() {
        this.duplicates = [];
        return this.api.get('contacts/duplicates', {
            include: 'contacts,contacts.addresses',
            fields: {
                contacts: 'addresses,name,square_avatar,status,created_at',
                addresses: 'city,postal_code,primary_mailing_address,state,street,source'
            },
            filter: { account_list_id: this.api.account_list_id },
            per_page: 5
        }).then(data => {
            /* istanbul ignore next */
            this.$log.debug('contacts/duplicates', data);
            this.setMeta(data.meta);
            this.duplicates = data;
        });
    }

    setMeta(meta) {
        this.meta = meta;

        if (this.meta && this.meta.pagination && this.meta.pagination.total_count && this.tools.analytics) {
            this.tools.analytics['duplicate-contacts'] = this.meta.pagination.total_count;
        }
    }

    confirmButtonDisabled() {
        return filter(duplicate => (duplicate.mergeChoice !== -1), this.duplicates).length === 0;
    }
}
const MergeContacts = {
    controller: MergeContactsController,
    template: require('./contacts.html')
};

import blockUi from 'angular-block-ui';
import gettext from 'angular-gettext';
import uiRouter from '@uirouter/angularjs';
import alerts from 'common/alerts/alerts.service';
import api from 'common/api/api.service';
import contacts from 'contacts/contacts.service';
import tools from 'tools/tools.service';

export default angular.module('mpdx.tools.merge.contacts.component', [
    blockUi, uiRouter, gettext,
    alerts, api, contacts, tools
]).component('mergeContacts', MergeContacts).name;
