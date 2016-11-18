class menuController {
    currentAccountList;
    state;

    constructor($state, currentAccountList, HelpService) {
        this.currentAccountList = currentAccountList;
        this.helpService = HelpService;
        this.state = $state;
        this.isInState = (match) => $state.$current.name.indexOf(match) === 0;
    }

    showHelp() {
        this.helpService.showHelp();
    }
}

const menuComponent = {
    controller: menuController,
    template: require('./menu.html')
};

export default angular.module('mpdx.menu.component', [])
    .component('menu', menuComponent).name;
