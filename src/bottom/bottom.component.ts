import help, { HelpService } from '../common/help/help.service';

class BottomController {
    year: number;
    constructor(
        private help: HelpService
    ) {
        this.year = new Date().getFullYear();
    }
    showHelp() {
        this.help.showHelp();
    }
}

const Bottom = {
    template: require('./bottom.html'),
    controller: BottomController
};

// don't add help dependency here. Uses mock for testing
export default angular.module('mpdx.bottom.component', [
]).component('bottom', Bottom).name;
