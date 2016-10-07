class HomeController {
    currentAccountList;
    currentUser;
    constructor(currentUser, currentAccountList) {
        this.currentUser = currentUser;
        this.currentAccountList = currentAccountList;
    }
    $onInit() {
        this.currentAccountList.getTasks();
    }
}
const Home = {
    template: require('./home.html'),
    controller: HomeController
};

import care from './care/care.component';
import commitments from './commitments/commitments.component';
import connect from './connect/connect.component';
export default angular.module('mpdx.home', [
    care,
    commitments,
    connect
]).component('home', Home).name;