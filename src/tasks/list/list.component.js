class ListController {
    tasks;

    constructor(
        $rootScope,
        tasks, tasksFilter, tasksTags
    ) {
        this.tasks = tasks;
        this.tasksFilter = tasksFilter;
        this.tasksTags = tasksTags;

        $rootScope.$on('taskChange', () => {
            this.tasks.load();
        });

        $rootScope.$on('tasksFilterChange', () => {
            this.tasks.load();
        });

        $rootScope.$on('tasksTagsChanged', () => {
            this.tasks.reset();
        });

        $rootScope.$on('accountListUpdated', () => {
            this.tasksFilter.reset();
            this.tasksFilter.load(true);
            this.tasksTags.load(true);
            this.tasks.reset();
        });
    }
    $onChanges() {
        this.tasks.reset();
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
