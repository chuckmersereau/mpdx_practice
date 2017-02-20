class PreferencesMonthlyGoalController {
    accounts;
    saving;
    constructor(
        accounts
    ) {
        this.accounts = accounts;

        this.saving = false;
    }
    save() {
        this.onSave();
    }
}

const PreferencesMonthlyGoal = {
    template: require('./monthlyGoal.html'),
    controller: PreferencesMonthlyGoalController,
    bindings: {
        onSave: '&'
    }
};

export default angular.module('mpdx.preferences.personal.monthlyGoal.component', [])
    .component('preferencesMonthlyGoal', PreferencesMonthlyGoal).name;