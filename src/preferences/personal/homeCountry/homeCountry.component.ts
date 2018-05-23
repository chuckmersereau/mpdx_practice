import accounts, { AccountsService } from '../../../common/accounts/accounts.service';

class HomeCountryController {
    saving: boolean;
    constructor(
        private accounts: AccountsService
    ) {
        this.saving = false;
    }
}

const HomeCountry = {
    template: require('./homeCountry.html'),
    controller: HomeCountryController
};

export default angular.module('mpdx.preferences.personal.homeCountry.component', [
    accounts
]).component('preferencesPersonalHomeCountry', HomeCountry).name;
