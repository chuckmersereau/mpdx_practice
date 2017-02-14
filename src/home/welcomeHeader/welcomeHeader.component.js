class welcomeHeaderController {
    contacts;
    users;

    constructor(
        contacts, users
    ) {
        this.contacts = contacts;
        this.users = users;
    }
    finish() {
        this.users.current.options.welcome_tour = { done: { value: 'preferences' } };
        this.users.createOption('welcome_tour', 'done');
    }
}

const welcomeHeaderComponent = {
    controller: welcomeHeaderController,
    template: require('./welcomeHeader.html')
};

export default angular.module('mpdx.home.welcomeHeader', [])
    .component('welcomeHeader', welcomeHeaderComponent).name;

