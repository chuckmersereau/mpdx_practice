class HomeController {
    accounts;
    contacts;
    tasksService;
    users;
    constructor(
        $log, $q, blockUI,
        accounts, contacts, help, tasksService, users
    ) {
        this.$log = $log;
        this.$q = $q;
        this.accounts = accounts;
        this.blockUI = blockUI.instances.get('homeMid');
        this.contacts = contacts;
        this.tasksService = tasksService;
        this.users = users;

        this.blockUI.start();

        help.suggest([
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
    }
    $onInit() {
        this.$q.all([
            this.contacts.getAnalytics(),
            this.tasksService.getAnalytics(),
            this.accounts.getAnalytics()
        ]).then(() => {
            this.blockUI.stop();
        });
    }
}
const Home = {
    template: require('./home.html'),
    controller: HomeController
};

export default angular.module('mpdx.home.component', [])
    .component('home', Home).name;