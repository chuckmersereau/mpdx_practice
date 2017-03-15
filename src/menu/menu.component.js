import get from 'lodash/fp/get';

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
        this.state = $state;
        this.tasks = tasks;
        this.users = users;

        this.isInState = (match) => $state.$current.name.indexOf(match) === 0;
    }
    showHelp() {
        this.help.showHelp();
    }
    isInSetup() {
        return get('current.options.setup_position.value', this.users) !== '';
    }
}

const menuComponent = {
    controller: menuController,
    template: require('./menu.html')
};

export default angular.module('mpdx.menu.component', [])
    .component('menu', menuComponent).name;
