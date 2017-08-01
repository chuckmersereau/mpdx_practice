export class BottomController {
    constructor(help) {
        this.help = help;
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

export default angular.module('mpdx.bottom.component', [])
    .component('bottom', Bottom).name;
