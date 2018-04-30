class WelcomeController {
    constructor(
        private users: UsersService
    ) {}
}

const Welcome = {
    controller: WelcomeController,
    template: require('./welcome.html')
};

import users, { UsersService } from '../../common/users/users.service';

export default angular.module('mpdx.home.welcome', [
    users
]).component('homeWelcome', Welcome).name;
