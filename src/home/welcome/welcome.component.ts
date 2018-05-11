import users, { UsersService } from '../../common/users/users.service';

class WelcomeController {
    constructor(
        private users: UsersService
    ) {}
}

const Welcome = {
    controller: WelcomeController,
    template: require('./welcome.html')
};

export default angular.module('mpdx.home.welcome', [
    users
]).component('homeWelcome', Welcome).name;
