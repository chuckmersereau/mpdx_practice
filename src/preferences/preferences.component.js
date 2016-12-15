class PreferencesController {
    constructor(help) {
        help.suggest([
            '57e2f280c697910d0784d307',
            '5845aa229033600698176a54',
            '5845ae09c6979106d373a589',
            '5845a6de9033600698176a43'
        ]);
    }
}

const Preferences = {
    controller: PreferencesController,
    controllerAs: 'vm',
    template: require('./preferences.html')
};

export default angular.module('mpdx.preferences.component', [])
    .component('preferences', Preferences).name;
