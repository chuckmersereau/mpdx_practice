import setup, { SetupService } from '../setup.service';

class StartController {
    saving: boolean;
    constructor(
        private setup: SetupService
    ) {
        this.setup = setup;
    }
    $onInit() {
        this.setup.setPosition('start');
    }
    next() {
        this.saving = true;
        return this.setup.next().then(() => {
            this.saving = false;
        });
    }
}

const Start = {
    template: require('./start.html'),
    controller: StartController
};

export default angular.module('mpdx.setup.start.component', [
    setup
]).component('setupStart', Start).name;
