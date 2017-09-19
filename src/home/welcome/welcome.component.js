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

import users from 'common/users/users.service';

export default angular.module('mpdx.home.welcome', [
    users
]).component('homeWelcome', Welcome).name;
