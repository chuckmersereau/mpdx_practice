import assign from 'lodash/fp/assign';
import contains from 'lodash/fp/contains';
import emptyToNull from 'common/fp/emptyToNull';
import joinComma from 'common/fp/joinComma';
import map from 'lodash/fp/map';
import removeObjectNulls from 'common/fp/removeObjectNulls';

class WizardController {
    constructor(
        $log, $q, $rootScope, $state,
        api, contacts, contactsTags, serverConstants
    ) {
        this.$q = $q;
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.$state = $state;
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
        return removeObjectNulls({
            started_giving_within: contains('joinedTeam3months', this.excludes)
                ? '3' : null,
            gave_more_than_pledged_within: contains('specialGift3months', this.excludes)
                ? '3' : null,
            pledge_amount_increased_within: contains('increasedGiving3months', this.excludes)
                ? '3' : null,
            stopped_giving_within: contains('stoppedGiving2months', this.excludes)
                ? '2' : null,
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
import contactTags from 'contacts/sidebar/filter/tags/tags.service';
import serverConstants from 'common/serverConstants/serverConstants.service';
import uiRouter from '@uirouter/angularjs';

export default angular.module('mpdx.tools.appeals.wizard.component', [
    uiRouter,
    contacts, contactTags, serverConstants
]).component('appealsWizard', AppealsWizard).name;
