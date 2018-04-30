import { StateService } from '@uirouter/core';

class FinishController {
    constructor(
        private $state: StateService,
        private setup: SetupService
    ) {
        this.$state = $state;
        this.setup = setup;
    }
    $onInit() {
        this.setup.setPosition('finish');
    }
    next() {
        return this.setup.setPosition('').then(() => {
            this.$state.go('tools', { setup: true });
        });
    }
    dashboard() {
        return this.setup.setPosition('').then(() => {
            this.$state.go('home');
        });
    }
}

const Finish = {
    template: require('./finish.html'),
    controller: FinishController
};

import uiRouter from '@uirouter/angularjs';
import setup, { SetupService } from '../setup.service';

export default angular.module('mpdx.setup.finish.component', [
    uiRouter,
    setup
]).component('setupFinish', Finish).name;
