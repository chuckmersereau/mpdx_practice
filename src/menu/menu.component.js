/*global HS*/
class menuController {
    constructor($state) {
        this.state = $state;
        this.isInState = (match) => $state.$current.name.indexOf(match) === 0;
    }

    showHelp() {
        HS.beacon.open();
    }
}

const menuComponent = {
    controller: menuController,
    template: require('./menu.html')
};

export default angular.module('mpdx.menu.component', [])
    .component('menu', menuComponent).name;
