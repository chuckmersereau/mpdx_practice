class StartController {
    constructor(
        setup
    ) {
        this.setup = setup;
    }

    $onInit() {
        this.setup.setPosition('start');
    }
}

const Start = {
    template: require('./start.html'),
    controller: StartController
};

import setup from 'setup/setup.service';

export default angular.module('mpdx.setup.start.component', [
    setup
]).component('setupStart', Start).name;
