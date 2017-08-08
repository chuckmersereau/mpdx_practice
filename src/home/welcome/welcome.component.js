class WelcomeController {
    constructor(
        users
    ) {
        this.users = users;
    }
}

const Welcome = {
    controller: WelcomeController,
    template: require('./welcome.html')
};

export default angular.module('mpdx.home.welcome', [])
    .component('homeWelcome', Welcome).name;
