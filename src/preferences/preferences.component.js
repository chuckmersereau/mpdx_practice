class PreferencesController {
    accounts;

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

export default angular.module('mpdx.preferences.component', [])
    .component('preferences', Preferences).name;
