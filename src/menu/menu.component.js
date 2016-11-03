class menuController {
    state;

    constructor($state, currentAccountList) {
        this.currentAccountList = currentAccountList;
        this.state = $state;
        this.isInState = (match) => $state.$current.name.indexOf(match) === 0;
    }
}

const menuComponent = {
    controller: menuController,
    template: require('./menu.html')
};

export default angular.module('mpdx.menu.component', [])
    .component('menu', menuComponent).name;
