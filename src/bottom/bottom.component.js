require('./bottom.scss');

export class BottomController {
    constructor(HelpService) {
        this.helpService = HelpService;
        this.year = new Date().getFullYear();
    }

    showHelp() {
        this.helpService.showHelp();
    }
}
const Bottom = {
    template: require('./bottom.html'),
    controller: BottomController
};

export default angular.module('mpdx.bottom.component', [])
    .component('bottom', Bottom).name;
