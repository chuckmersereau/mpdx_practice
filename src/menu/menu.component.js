class menuController {
    accounts;
    contactDonations;
    help;
    contactReconciler;
    state;
    users;

    constructor(
        $state,
        accounts, contactDonations, help, contactReconciler, users
    ) {
        this.accounts = accounts;
        this.contactDonations = contactDonations;
        this.help = help;
        this.contactReconciler = contactReconciler;
        this.state = $state;
        this.users = users;
        this.isInState = (match) => $state.$current.name.indexOf(match) === 0;
    }
    showHelp() {
        this.help.showHelp();
    }
    isInSetup() {
        return _.get(this.users, 'current.options.setup_position.value') !== '';
    }
}

const menuComponent = {
    controller: menuController,
    template: require('./menu.html')
};

export default angular.module('mpdx.menu.component', [])
    .component('menu', menuComponent).name;
