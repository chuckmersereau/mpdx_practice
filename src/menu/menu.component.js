class menuController {
    currentAccountList;
    donationsService;
    rolloutService;
    state;

    constructor(
        $state,
        currentAccountList, donationsService, HelpService, rolloutService
    ) {
        this.currentAccountList = currentAccountList;
        this.donationsService = donationsService;
        this.helpService = HelpService;
        this.rolloutService = rolloutService;
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
