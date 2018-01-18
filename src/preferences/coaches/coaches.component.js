class CoachesController {
    constructor(
        $stateParams, gettextCatalog,
        help
    ) {
        this.$stateParams = $stateParams;
        this.gettextCatalog = gettextCatalog;
        this.help = help;

        this.tabId = 'share_coaching_account';
    }
    $onInit() {
        this.help.suggest([
            this.gettextCatalog.getString('57e2f280c697910d0784d307')
        ]);

        if (this.$stateParams.id) {
            this.setTab(this.$stateParams.id);
        }
    }
    setTab(service) {
        if (this.tabId === service) {
            this.tabId = '';
        } else {
            this.tabId = service;
        }
    }
}

const Coaches = {
    controller: CoachesController,
    template: require('./coaches.html')
};

import uiRouter from '@uirouter/angularjs';
import gettextCatalog from 'angular-gettext';
import help from 'common/help/help.service';

export default angular.module('mpdx.preferences.coaches.component', [
    uiRouter, gettextCatalog,
    help
]).component('preferencesCoaches', Coaches).name;
