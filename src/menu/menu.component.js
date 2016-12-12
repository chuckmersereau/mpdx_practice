class menuController {
    accounts;
    donationsService;
    helpService;
    rolloutService;
    state;

    constructor(
        $state,
        accounts, donationsService, helpService, rolloutService
    ) {
        this.accounts = accounts;
        this.donationsService = donationsService;
        this.helpService = helpService;
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
