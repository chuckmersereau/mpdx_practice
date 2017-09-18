class PreferencesController {
    constructor(
        gettextCatalog,
        accounts, help
    ) {
        this.gettextCatalog = gettextCatalog;

        this.accounts = accounts;

        help.suggest([
            this.gettextCatalog.getString('57e2f280c697910d0784d307'),
            this.gettextCatalog.getString('5845aa229033600698176a54'),
            this.gettextCatalog.getString('5845ae09c6979106d373a589'),
            this.gettextCatalog.getString('5845a6de9033600698176a43')
        ]);
    }
}

const Preferences = {
    controller: PreferencesController,
    template: require('./preferences.html')
};

import accounts from 'common/accounts/accounts.service';
import gettextCatalog from 'angular-gettext';

export default angular.module('mpdx.preferences.component', [
    accounts, gettextCatalog
]).component('preferences', Preferences).name;
