class TasksController {
    tasksFilter;
    tasks;
    constructor(
        $log, $rootScope, $stateParams,
        tasksFilter, tasks
    ) {
        this.$stateParams = $stateParams;
        this.tasksFilter = tasksFilter;
        this.tasks = tasks;

        this.changed = 0;

        $rootScope.$on('taskFilterChange', () => {
            $log.debug('tasks component: filter change');
            this.changed++;
        });

        $rootScope.$on('tasksTagsChanged', (event, filters) => {
            $log.debug('tasks component: tag change', filters);
            this.changed++;
        });

        $rootScope.$on('accountListUpdated', () => {
            this.changed++;
        });
    }
    $onInit() {
        if (this.$stateParams.filters) {
            _.assign(this.tasksFilter.params, this.tasksFilter.params, this.$stateParams.filters);
            this.tasksFilter.change();
        }
    }
    onSearchChanged(wildcard) {
        this.tasksFilter.wildcard_search = wildcard;
        this.tasksFilter.change();
    }
}

const Tasks = {
    controller: TasksController,
    template: require('./tasks.html')
};

export default angular.module('mpdx.tasks.component', [])
    .component('tasks', Tasks).name;