class HomeCountryController {
    accounts;
    saving;
    constructor(
        accounts
    ) {
        this.saving = false;
        this.accounts = accounts;
    }
}

const HomeCountry = {
    template: require('./homeCountry.html'),
    controller: HomeCountryController
};

export default angular.module('mpdx.preferences.personal.homeCountry.component', [])
    .component('preferencesPersonalHomeCountry', HomeCountry).name;
