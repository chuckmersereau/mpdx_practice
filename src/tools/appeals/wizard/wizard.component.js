import assign from 'lodash/fp/assign';
import contains from 'lodash/fp/contains';
import concat from 'lodash/fp/concat';
import emptyToNull from 'common/fp/emptyToNull';
import find from 'lodash/fp/find';
import joinComma from 'common/fp/joinComma';
import map from 'lodash/fp/map';
import moment from 'moment';
import reduce from 'lodash/fp/reduce';
import removeObjectNulls from 'common/fp/removeObjectNulls';

class WizardController {
    constructor(
        $log, $q, $rootScope, $state,
        api, contactFilter, contacts, contactsTags, serverConstants
    ) {
        this.$q = $q;
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.$state = $state;
        this.api = api;
        this.contactFilter = contactFilter;
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

        this.statusFilter = find({ name: 'status' }, this.contactFilter.data);
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
        const adminPercent = Number(this.goal.adminPercent) / 100 + 1;
        const initialGoal = Number(this.goal.initial);
        const letterCost = Number(this.goal.letterCost);
        this.appeal.amount = Math.round((initialGoal + letterCost) * adminPercent * 100) / 100;
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
        return this.create(this.appeal).then((data) => {
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

import contacts from 'contacts/contacts.service';
import contactFilter from 'contacts/sidebar/filter/filter.service';
import contactTags from 'contacts/sidebar/filter/tags/tags.service';
import uiRouter from '@uirouter/angularjs';

export default angular.module('mpdx.tools.appeals.wizard.component', [
    uiRouter,
    contactFilter, contacts, contactTags
]).component('appealsWizard', AppealsWizard).name;
