class menuController {
    accounts;
    contactDonations;
    help;
    contactReconciler;
    state;
    tasksService;
    users;

    constructor(
        $rootScope, $state,
        accounts, contacts, contactDonations, contactReconciler, help, tasksService, users
    ) {
        this.$rootScope = $rootScope;
        this.accounts = accounts;
        this.contacts = contacts;
        this.contactDonations = contactDonations;
        this.help = help;
        this.contactReconciler = contactReconciler;
        this.state = $state;
        this.tasksService = tasksService;
        this.users = users;

        this.isInState = (match) => $state.$current.name.indexOf(match) === 0;
    }
    $onInit() {
        this.contactReconciler.fetchAll(true);

        this.$rootScope.$on('accountListUpdated', () => {
            this.contactReconciler.fetchAll(true);
        });
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
