class menuController {
    accounts;
    contactDonations;
    help;
    rollout;
    state;

    constructor(
        $state,
        accounts, contactDonations, help, rollout
    ) {
        this.accounts = accounts;
        this.contactDonations = contactDonations;
        this.help = help;
        this.rollout = rollout;
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
