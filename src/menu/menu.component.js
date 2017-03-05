class menuController {
    accounts;
    contacts;
    contactDonations;
    contactReconciler;
    help;
    state;
    tasksService;
    tools;
    users;

    constructor(
        $rootScope, $state,
        accounts, contacts, contactDonations, contactReconciler, help, tasksService, users, donations, tools
    ) {
        this.$rootScope = $rootScope;
        this.accounts = accounts;
        this.contacts = contacts;
        this.donations = donations;
        this.contactDonations = contactDonations;
        this.contactReconciler = contactReconciler;
        this.help = help;
        this.state = $state;
        this.tasksService = tasksService;
        this.tools = tools;
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
