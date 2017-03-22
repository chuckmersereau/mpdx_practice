class menuController {
    contacts;
    donations;
    help;
    state;
    tasks;
    tools;
    users;

    constructor(
        $rootScope, $state,
        contacts, help, tasks, users, donations
    ) {
        this.$rootScope = $rootScope;
        this.contacts = contacts;
        this.donations = donations;
        this.help = help;
        this.$state = $state;
        this.tasks = tasks;
        this.users = users;

        this.isInState = (match) => this.$state.$current.name.indexOf(match) === 0;
        this.notifications = { count: 0 };
    }
    showHelp() {
        this.help.showHelp();
    }
    go(location) {
        if (!this.setup) this.$state.go(location);
    }
}

const menuComponent = {
    controller: menuController,
    template: require('./menu.html'),
    bindings: {
        setup: '<'
    }
};

export default angular.module('mpdx.menu.component', [])
    .component('menu', menuComponent).name;
