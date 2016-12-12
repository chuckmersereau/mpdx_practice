class HomeController {
    users;
    constructor(users) {
        this.users = users;
    }
}
const Home = {
    template: require('./home.html'),
    controller: HomeController
};

export default angular.module('mpdx.home.component', [])
    .component('home', Home).name;