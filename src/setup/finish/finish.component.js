class FinishController {
    constructor(
        $state,
        setup
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
import setup from 'setup/setup.service';

export default angular.module('mpdx.setup.finish.component', [
    uiRouter,
    setup
]).component('setupFinish', Finish).name;
