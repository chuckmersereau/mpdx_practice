class ListController {
    tasks;

    constructor(
        $rootScope,
        tasks
    ) {
        this.tasks = tasks;

        $rootScope.$on('taskChange', () => {
            this.tasks.load(true);
        });

        this.tasks.reset();
    }
    $onInit() {
        this.tasks.load(true);
    }
}

const TaskList = {
    controller: ListController,
    template: require('./list.html'),
    bindings: {
        contact: '<'
    }
};

export default angular.module('mpdx.tasks.list.component', [])
    .component('tasksList', TaskList).name;
