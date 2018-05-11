import 'angular-gettext';
import { concat, filter, map, reduce } from 'lodash/fp';
import { StateService } from '@uirouter/core';
import alerts, { AlertsService } from '../../../common/alerts/alerts.service';
import api, { ApiService } from '../../../common/api/api.service';
import people, { PeopleService } from '../../../contacts/show/people/people.service';
import reduceObject from '../../../common/fp/reduceObject';
import tools, { ToolsService } from '../../tools.service';
import uiRouter from '@uirouter/angularjs';

class MergePeopleController {
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
        private people: PeopleService,
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
        const alreadySelected = !!duplicate.people[index].selected;
        duplicate.people = reduceObject((result, value, rIndex) => {
            value.selected = rIndex === index ? !alreadySelected : false;
            return concat(result, value);
        }, [], duplicate.people);
    }
    selectIgnore(duplicate) {
        duplicate.ignore = true;
        duplicate.people[0].selected = false;
        duplicate.people[1].selected = false;
    }
    confirm() {
        let promises = [];
        const peopleToMerge = filter((duplicate) => {
            return (duplicate.people[0].selected || duplicate.people[1].selected) && duplicate.ignore === false;
        }, this.duplicates);
        const peopleToIgnore = filter({ ignore: true }, this.duplicates);
        if (peopleToMerge.length > 0) {
            promises.push(this.merge(peopleToMerge));
        }
        if (peopleToIgnore.length > 0) {
            promises.push(...this.ignore(peopleToIgnore));
        }
        return this.$q.all(promises).then(() => {
            this.alerts.addAlert(this.gettextCatalog.getString('People successfully merged'));
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
                url: `contacts/people/duplicates/${duplicate.id}`,
                data: { id: duplicate.id, ignore: true },
                type: 'duplicate_record_pairs' })
            , duplicates);
    }
    merge(duplicates) {
        const winnersAndLosers = map((duplicate) => {
            if (duplicate.people[0].selected) {
                return { winner_id: duplicate.people[0].id, loser_id: duplicate.people[1].id };
            }
            return { winner_id: duplicate.people[1].id, loser_id: duplicate.people[0].id };
        }, duplicates);
        return this.people.bulkMerge(winnersAndLosers);
    }
    load() {
        this.loading = true;
        this.duplicates = [];
        return this.api.get(
            'contacts/people/duplicates',
            {
                include: 'records,records.phone_numbers,records.email_addresses',
                fields: {
                    people: 'avatar,email_addresses,phone_numbers,first_name,last_name,created_at',
                    phone_numbers: 'primary,number,source',
                    email_addresses: 'primary,email,source',
                    person_duplicates: 'people,shared_contact'
                },
                filter: { account_list_id: this.api.account_list_id, ignore: false },
                per_page: 5
            }
        ).then((data: any) => {
            this.loading = false;
            /* istanbul ignore next */
            this.$log.debug('contacts/people/duplicates', data);
            this.setMeta(data.meta);

            this.duplicates = reduce((result, duplicate) => {
                duplicate.people = duplicate.records;
                delete duplicate.records;
                result.push(duplicate);
                return result;
            }, [], data);

            this.duplicates.meta = data.meta;
        });
    }
    setMeta(meta) {
        this.meta = meta;

        if (this.meta && this.meta.pagination && this.meta.pagination.total_count >= 0 && this.tools.analytics) {
            this.tools.analytics['duplicate-people'] = this.meta.pagination.total_count;
        }
    }
    confirmButtonDisabled() {
        return filter((duplicate) => {
            return duplicate.ignore === true
            || duplicate.people[0].selected === true
            || duplicate.people[1].selected === true;
        }, this.duplicates).length === 0;
    }
}

const MergePeople = {
    controller: MergePeopleController,
    template: require('./people.html')
};

export default angular.module('mpdx.tools.merge.people.component', [
    uiRouter, 'gettext',
    alerts, api, people, tools
]).component('mergePeople', MergePeople).name;
