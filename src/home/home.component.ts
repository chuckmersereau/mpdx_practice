import help, { HelpService } from '../common/help/help.service';
import tasks, { TasksService } from '../tasks/tasks.service';

class HomeController {
    blockUI: IBlockUIService;
    blockUI2: IBlockUIService;
    watcher: () => void;
    watcher2: () => void;
    constructor(
        $rootScope: ng.IRootScopeService,
        blockUI: IBlockUIService,
        private gettextCatalog: ng.gettext.gettextCatalog,
        help: HelpService,
        private tasks: TasksService
    ) {
        this.blockUI = blockUI.instances.get('care');
        this.blockUI2 = blockUI.instances.get('connect');

        help.suggest([
            this.gettextCatalog.getString('584aced8c697912ffd6bc297'),
            this.gettextCatalog.getString('58496f15c6979106d373bb65'),
            this.gettextCatalog.getString('58481fd3c6979106d373b4f6'),
            this.gettextCatalog.getString('57e3ecaec697910d0784d8b9'),
            this.gettextCatalog.getString('584820bc9033600698177a95'),
            this.gettextCatalog.getString('58481f069033600698177a78'),
            this.gettextCatalog.getString('58481e189033600698177a69'),
            this.gettextCatalog.getString('58482329c6979106d373b517'),
            this.gettextCatalog.getString('58496d4ec6979106d373bb57'),
            this.gettextCatalog.getString('58496bf1903360069817816c')
        ]);

        this.watcher = $rootScope.$on('taskChange', () => {
            this.load();
        });

        this.watcher2 = $rootScope.$on('accountListUpdated', () => {
            this.load();
        });
    }
    $onInit() {
        this.load();
    }
    $onDestroy() {
        this.watcher();
        this.watcher2();
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

export default angular.module('mpdx.home.component', [
    help, tasks
]).component('home', Home).name;
