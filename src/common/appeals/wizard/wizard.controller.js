class AppealsWizardController {
    constructor($scope, api, railsConstants, state) {
        this.$scope = $scope;

        this.contactStatuses = railsConstants.contact.ACTIVE_STATUSES;

        let defaultValidStatuses = {};
        _.each(this.contactStatuses, (contactStatus) => {
            defaultValidStatuses[contactStatus] = true;
        });

        this.goal = {
            adminPercent: 12
        };

        this.appeal = {
            validStatus: defaultValidStatuses,
            validTags: {},
            exclude: {
                specialGift3months: true,
                joinedTeam3months: true,
                increasedGiving3months: true,
                stoppedGiving2months: true,
                doNotAskAppeals: true
            }
        };
        api.get('contacts/tags?account_list_id=' + (state.current_account_list_id || '')).then((data) => {
            this.contactTags = data.tags.sort();
        });
    }
    save() {
        this.$scope.$hide(this.appeal);
    }
    calculateGoal(goal) {
        const adminPercent = Number(goal.adminPercent) / 100 + 1;
        this.appeal.amount = Math.round((Number(goal.initial) + Number(goal.letterCost)) * adminPercent * 100) / 100;
    }
}

export default angular.module('mpdx.common.appeals.wizard.controller', [])
    .controller('appealsWizardController', AppealsWizardController).name;