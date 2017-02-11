class TasksController {
    tasksFilter;
    tasksService;
    constructor(
        $log, $rootScope,
        tasksFilter, tasksService
    ) {
        this.tasksFilter = tasksFilter;
        this.tasksService = tasksService;

        this.changed = 0;

        $rootScope.$on('taskFilterChange', () => {
            $log.debug('tasks component: filter change');
            this.changed++;
        });

        $rootScope.$on('tasksTagsChanged', (event, filters) => {
            $log.debug('tasks component: tag change', filters);
            this.changed++;
        });
    }
    $onInit() {
        if (this.$stateParams.filters) {
            _.assign(this.tasksFilter.params, this.tasksFilter.params, this.$stateParams.filters);
            this.tasksFilter.change();
        }
    }
}

const Tasks = {
    controller: TasksController,
    template: require('./tasks.html')
};

export default angular.module('mpdx.tasks.component', [])
    .component('tasks', Tasks).name;