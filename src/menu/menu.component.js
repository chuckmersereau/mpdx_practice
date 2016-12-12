class menuController {
    accounts;
    donationsService;
    help;
    rolloutService;
    state;

    constructor(
        $state,
        accounts, donationsService, help, rolloutService
    ) {
        this.accounts = accounts;
        this.donationsService = donationsService;
        this.help = help;
        this.rolloutService = rolloutService;
        this.state = $state;
        this.isInState = (match) => $state.$current.name.indexOf(match) === 0;
    }
    showHelp() {
        this.help.showHelp();
    }
}

const menuComponent = {
    controller: menuController,
    template: require('./menu.html')
};

export default angular.module('mpdx.menu.component', [])
    .component('menu', menuComponent).name;
