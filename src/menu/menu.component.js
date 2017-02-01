class menuController {
    accounts;
    contactDonations;
    help;
    contactReconciler;
    state;

    constructor(
        $state,
        accounts, contactDonations, help, contactReconciler
    ) {
        this.accounts = accounts;
        this.contactDonations = contactDonations;
        this.help = help;
        this.contactReconciler = contactReconciler;
        this.state = $state;
        this.isInState = (match) => $state.$current.name.indexOf(match) === 0;

        this.contactReconciler.fetchAll();
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
