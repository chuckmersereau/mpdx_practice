class menuController {
    currentAccountList;
    contactDonations;
    help;
    state;

    constructor(
        $state,
        currentAccountList, contactDonations, help
    ) {
        this.currentAccountList = currentAccountList;
        this.contactDonations = contactDonations;
        this.help = help;
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
