class SetupStartController {
    locale;
    users;
    constructor(
        $state, $window,
        locale, users
    ) {
        this.$state = $state;
        this.locale = locale;
        this.users = users;

        this.locale = navigator.language || navigator.browserLanguage || navigator.systemLanguage || navigator.userLanguage || 'en-us';

        this.languages = _.map(_.keys($window.languageMappingList), (key) => {
            return _.extend({alias: key}, window.languageMappingList[key]);
        });
    }
    begin() {
        this.users.current.preferences.locale = this.locale;
        this.users.saveCurrent().then(() => {
            this.$state.go('setup.connect');
        });
    }
    setLocale() {
        this.locale.change(this.locale);
    }
}

const SetupStart = {
    template: require('./start.html'),
    controller: SetupStartController
};

export default angular.module('mpdx.setup.start.component', [])
    .component('setupStart', SetupStart).name;


