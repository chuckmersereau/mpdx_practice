import 'angular-gettext';
import { concat, filter, map, reduce } from 'lodash/fp';
import { StateService } from '@uirouter/core';
import alerts, { AlertsService } from '../../../common/alerts/alerts.service';
import api, { ApiService } from '../../../common/api/api.service';
import contacts, { ContactsService } from '../../../contacts/contacts.service';
import reduceObject from '../../../common/fp/reduceObject';
import tools, { ToolsService } from '../../tools.service';
import uiRouter from '@uirouter/angularjs';

class MergeContactsController {
    duplicates: any;
    loading: boolean;
    meta: any;
    total: number;
    constructor(
        private $log: ng.ILogService,
        private $q: ng.IQService,
        private $rootScope: ng.IRootScopeService,
        private $state: StateService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private alerts: AlertsService,
        private api: ApiService,
        private contacts: ContactsService,
        private tools: ToolsService
    ) {
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
                contacts: 'addresses,name,square_avatar,status,created_at',
                addresses: 'city,postal_code,primary_mailing_address,state,street,source'
            },
            filter: { account_list_id: this.api.account_list_id, ignore: false },
            per_page: 5
        }).then((data: any) => {
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

        if (this.meta && this.meta.pagination && this.meta.pagination.total_count >= 0 && this.tools.analytics) {
            this.tools.analytics['duplicate-contacts'] = this.meta.pagination.total_count;
        }
    }
    confirmButtonDisabled() {
        return filter((duplicate) => {
            return duplicate.ignore === true
            || duplicate.contacts[0].selected === true
            || duplicate.contacts[1].selected === true;
        }, this.duplicates).length === 0;
    }
}
const MergeContacts = {
    controller: MergeContactsController,
    template: require('./contacts.html')
};

export default angular.module('mpdx.tools.merge.contacts.component', [
    uiRouter, 'gettext',
    alerts, api, contacts, tools
]).component('mergeContacts', MergeContacts).name;
