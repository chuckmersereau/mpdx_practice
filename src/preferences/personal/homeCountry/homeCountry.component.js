class HomeCountryController {
    constructor(
        accounts
    ) {
        this.accounts = accounts;

        this.saving = false;
    }
}

const HomeCountry = {
    template: require('./homeCountry.html'),
    controller: HomeCountryController
};

import accounts from 'common/accounts/accounts.service';

export default angular.module('mpdx.preferences.personal.homeCountry.component', [
    accounts
]).component('preferencesPersonalHomeCountry', HomeCountry).name;
