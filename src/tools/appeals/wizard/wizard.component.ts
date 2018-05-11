import * as moment from 'moment';
import { assign, concat, contains, find, map, reduce } from 'lodash/fp';
import { StateService } from '@uirouter/core';
import api, { ApiService } from '../../../common/api/api.service';
import contactFilter, { ContactFilterService } from '../../../contacts/sidebar/filter/filter.service';
import contacts, { ContactsService } from '../../../contacts/contacts.service';
import contactTags, { ContactsTagsService } from '../../../contacts/sidebar/filter/tags/tags.service';
import emptyToNull from '../../../common/fp/emptyToNull';
import joinComma from '../../../common/fp/joinComma';
import removeObjectNulls from '../../../common/fp/removeObjectNulls';
import serverConstants, { ServerConstantsService } from '../../../common/serverConstants/serverConstants.service';
import uiRouter from '@uirouter/angularjs';

class WizardController {
    appeal: any;
    excludes: string[];
    goal: any;
    saving: boolean;
    statuses: any[];
    statusFilter: any;
    tags: any[];
    watcher: () => void;
    constructor(
        private $log: ng.ILogService,
        private $q: ng.IQService,
        $rootScope: ng.IRootScopeService,
        private $state: StateService,
        private api: ApiService,
        private contactFilter: ContactFilterService,
        private contacts: ContactsService,
        private contactsTags: ContactsTagsService,
        private serverConstants: ServerConstantsService
    ) {
        this.watcher = $rootScope.$on('accountListUpdated', () => {
            this.contactsTags.load();
            this.init();
        });
    }
    $onInit() {
        this.init();

        this.statusFilter = find({ name: 'status' }, this.contactFilter.data);
    }
    $onDestroy() {
        this.watcher();
    }
    init() {
        this.statuses = [];
        this.tags = [];
        this.excludes = ['doNotAskAppeals'];
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
        const adminPercent = 1 - Number(this.goal.adminPercent) / 100;
        const initialGoal = Number(this.goal.initial);
        const letterCost = Number(this.goal.letterCost);
        this.appeal.amount = Math.round((initialGoal + letterCost) / adminPercent * 100) / 100;
    }
    selectAllStatuses() {
        if (this.statuses.length === this.statusFilter.options.length) {
            this.statuses = [];
        } else {
            this.statuses = reduce((result, value) => {
                return contains(value.id, ['hidden', 'active'])
                    ? result
                    : concat(result, value.id);
            }, [], this.statusFilter.options);
        }
    }
    selectAllTags() {
        if (this.tags.length === this.contactsTags.data.length) {
            this.tags = [];
        } else {
            this.tags = map('name', this.contactsTags.data);
        }
    }
    save() {
        this.saving = true;
        return this.create(this.appeal).then((data: any) => {
            /* istanbul ignore next */
            this.$log.debug('appealAdded', data);
            this.saving = false;
            this.$state.go('tools.appeals.show', { appealId: data.id });
        }).catch((ex) => {
            this.saving = false;
            throw ex;
        });
    }
    create(appeal) {
        appeal.account_list = { id: this.api.account_list_id };
        return this.api.post({
            url: 'appeals',
            data: assign(appeal, {
                inclusion_filter: removeObjectNulls({
                    account_list_id: this.api.account_list_id,
                    tags: emptyToNull(joinComma(this.tags)),
                    status: emptyToNull(joinComma(this.statuses)),
                    any_tags: true
                }),
                exclusion_filter: this.buildExclusionFilter()
            })
        });
    }
    buildExclusionFilter() {
        const today = moment().format('YYYY-MM-DD');
        const oneMonthAgo = moment().subtract(1, 'months').format('YYYY-MM-DD');
        const twoMonthsAgo = moment().startOf('month').subtract(2, 'months').format('YYYY-MM-DD');
        const threeMonthsAgo = moment().startOf('month').subtract(3, 'months').format('YYYY-MM-DD');

        return removeObjectNulls({
            started_giving_range: contains('joinedTeam3months', this.excludes)
                ? `${threeMonthsAgo}..${today}` : null,
            gave_more_than_pledged_range: contains('specialGift3months', this.excludes)
                ? `${threeMonthsAgo}..${today}` : null,
            pledge_amount_increased_range: contains('increasedGiving3months', this.excludes)
                ? `${threeMonthsAgo}..${today}` : null,
            stopped_giving_range: contains('stoppedGiving2months', this.excludes)
                ? `${twoMonthsAgo}..${oneMonthAgo}` : null,
            no_appeals: contains('doNotAskAppeals', this.excludes)
                ? true : null
        });
    }
}

const AppealsWizard = {
    controller: WizardController,
    template: require('./wizard.html')
};

export default angular.module('mpdx.tools.appeals.wizard.component', [
    uiRouter,
    api, contactFilter, contacts, contactTags, serverConstants
]).component('appealsWizard', AppealsWizard).name;
