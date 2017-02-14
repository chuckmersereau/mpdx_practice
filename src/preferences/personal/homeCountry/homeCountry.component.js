class PreferencesHomeCountryController {
    accounts;
    saving;
    constructor(
        accounts
    ) {
        this.saving = false;
        this.accounts = accounts;
    }
    save() {
        this.saving = true;
        this.onSave().then(() => {
            this.saving = false;
        });
    }
}

const PreferencesHomeCountry = {
    template: require('./homeCountry.html'),
    controller: PreferencesHomeCountryController,
    bindings: {
        onSave: '&'
    }
};

export default angular.module('mpdx.preferences.personal.homeCountry', [])
    .component('preferencesHomeCountry', PreferencesHomeCountry).name;