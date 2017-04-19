class HomeController {
    accounts;
    contacts;
    tasks;
    users;
    constructor(
        $rootScope, blockUI,
        help, tasks
    ) {
        this.tasks = tasks;

        this.blockUI = blockUI.instances.get('care');
        this.blockUI2 = blockUI.instances.get('connect');

        help.suggest([
            '58d3d70ddd8c8e7f5974d3ca',
            '584aced8c697912ffd6bc297',
            '58496f15c6979106d373bb65',
            '58481fd3c6979106d373b4f6',
            '57e3ecaec697910d0784d8b9',
            '584820bc9033600698177a95',
            '58481f069033600698177a78',
            '58481e189033600698177a69',
            '58482329c6979106d373b517',
            '58496d4ec6979106d373bb57',
            '58496bf1903360069817816c'
        ]);

        $rootScope.$on('taskChange', () => {
            this.load();
        });
    }
    $onInit() {
        this.load();
    }
    load() {
        this.blockUI.start();
        this.blockUI2.start();
        this.tasks.getAnalytics().then(() => {
            this.blockUI.reset();
            this.blockUI2.reset();
        });
    }
}
const Home = {
    template: require('./home.html'),
    controller: HomeController
};

export default angular.module('mpdx.home.component', [])
    .component('home', Home).name;
