class TasksController {
    help;
    constructor(
        gettextCatalog,
        help
    ) {
        this.gettextCatalog = gettextCatalog;

        help.suggest([
            this.gettextCatalog.getString('584acfaa9033602d65f6e191'),
            this.gettextCatalog.getString('58482329c6979106d373b517'),
            this.gettextCatalog.getString('584823979033600698177abb'),
            this.gettextCatalog.getString('584824fdc6979106d373b528'),
            this.gettextCatalog.getString('5848244c9033600698177abf'),
            this.gettextCatalog.getString('58496bf1903360069817816c'),
            this.gettextCatalog.getString('5848254b9033600698177ac7'),
            this.gettextCatalog.getString('58496a51c6979106d373bb48'),
            this.gettextCatalog.getString('58496adb9033600698178161')
        ]);
    }
}

const Tasks = {
    controller: TasksController,
    template: require('./tasks.html')
};

export default angular.module('mpdx.tasks.component', [])
    .component('tasks', Tasks).name;
