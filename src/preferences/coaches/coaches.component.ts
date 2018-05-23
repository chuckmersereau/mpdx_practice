import 'angular-gettext';
import { StateParams } from '@uirouter/core';
import help, { HelpService } from '../../common/help/help.service';
import uiRouter from '@uirouter/angularjs';

class CoachesController {
    tabId: string;
    constructor(
        private $stateParams: StateParams,
        private gettextCatalog: ng.gettext.gettextCatalog,
        private help: HelpService
    ) {
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

export default angular.module('mpdx.preferences.coaches.component', [
    uiRouter, 'gettext',
    help
]).component('preferencesCoaches', Coaches).name;
