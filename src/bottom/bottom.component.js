export class BottomController {
    constructor() {
        this.year = new Date().getFullYear();
    }
}
const Bottom = {
    template: require('./bottom.html'),
    controller: BottomController
};

export default angular.module('mpdx.bottom.component', [])
    .component('bottom', Bottom).name;
