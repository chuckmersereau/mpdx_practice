import concat from 'lodash/fp/concat';
import filter from 'lodash/fp/filter';
import map from 'lodash/fp/map';
import reduce from 'lodash/fp/reduce';
import reduceObject from 'common/fp/reduceObject';

class MergeContactsController {
    constructor(
        $log, $q, $rootScope,
        $state, gettextCatalog,
        alerts, api, contacts, tools
    ) {
        this.$log = $log;
        this.$q = $q;
        this.$rootScope = $rootScope;
        this.$state = $state;
        this.gettextCatalog = gettextCatalog;
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
        duplicate.ignore = false;
        const alreadySelected = !!duplicate.contacts[index].selected;
        duplicate.contacts = reduceObject((result, value, rIndex) => {
            value.selected = rIndex === index ? !alreadySelected : false;
            return concat(result, value);
        }, [], duplicate.contacts);
    }

    selectIgnore(duplicate) {
        duplicate.ignore = true;
        duplicate.contacts[0].selected = false;
        duplicate.contacts[1].selected = false;
    }

    confirm() {
        let promises = [];
        const contactsToMerge = filter((duplicate) => {
            return (duplicate.contacts[0].selected || duplicate.contacts[1].selected) && duplicate.ignore === false;
        }, this.duplicates);
        const contactsToIgnore = filter({ ignore: true }, this.duplicates);
        if (contactsToMerge.length > 0) {
            promises.push(this.merge(contactsToMerge));
        }
        if (contactsToIgnore.length > 0) {
            promises.push(...this.ignore(contactsToIgnore));
        }
        return this.$q.all(promises).then(() => {
            this.alerts.addAlert(this.gettextCatalog.getString('Contacts successfully merged'));
        });
    }

    confirmAndContinue() {
        return this.confirm().then(() => {
            return this.load();
        });
    }

    confirmThenLeave() {
        return this.confirm().then(() => {
            this.$state.go('tools');
        });
    }

    ignore(duplicates) {
        return map((duplicate) =>
            this.api.put({
                url: `contacts/duplicates/${duplicate.id}`,
                data: { id: duplicate.id, ignore: true },
                type: 'duplicate_record_pairs' })
            , duplicates);
    }

    merge(duplicates) {
        const winnersAndLosers = map((duplicate) => {
            if (duplicate.contacts[0].selected) {
                return { winner_id: duplicate.contacts[0].id, loser_id: duplicate.contacts[1].id };
            }
            return { winner_id: duplicate.contacts[1].id, loser_id: duplicate.contacts[0].id };
        }, duplicates);
        return this.contacts.merge(winnersAndLosers);
    }

    load() {
        this.loading = true;
        this.duplicates = [];
        return this.api.get('contacts/duplicates', {
            include: 'records,records.addresses',
            fields: {
                records: 'addresses,name,square_avatar,status,created_at',
                addresses: 'city,postal_code,primary_mailing_address,state,street,source'
            },
            filter: { account_list_id: this.api.account_list_id, ignore: false },
            per_page: 5
        }).then((data) => {
            this.loading = false;
            /* istanbul ignore next */
            this.$log.debug('contacts/duplicates', data);
            this.setMeta(data.meta);

            this.duplicates = reduce((result, duplicate) => {
                duplicate.contacts = duplicate.records;
                delete duplicate.records;
                result.push(duplicate);
                return result;
            }, [], data);

            this.duplicates.meta = data.meta;

            return this.duplicates;
        });
    }

    setMeta(meta) {
        this.meta = meta;

        if (this.meta && this.meta.pagination && this.meta.pagination.total_count && this.tools.analytics) {
            this.tools.analytics['duplicate-contacts'] = this.meta.pagination.total_count;
        }
    }

    confirmButtonDisabled() {
        return filter((duplicate) => (duplicate.mergeChoice !== -1), this.duplicates).length === 0;
    }
}
const MergeContacts = {
    controller: MergeContactsController,
    template: require('./contacts.html')
};

import gettext from 'angular-gettext';
import uiRouter from '@uirouter/angularjs';
import alerts from 'common/alerts/alerts.service';
import api from 'common/api/api.service';
import contacts from 'contacts/contacts.service';
import tools from 'tools/tools.service';

export default angular.module('mpdx.tools.merge.contacts.component', [
    uiRouter, gettext,
    alerts, api, contacts, tools
]).component('mergeContacts', MergeContacts).name;
