class menuController {
    currentAccountList;
    donationsService;
    helpService;
    state;

    constructor(
        $state,
        currentAccountList, donationsService, helpService
    ) {
        this.currentAccountList = currentAccountList;
        this.donationsService = donationsService;
        this.helpService = helpService;
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
