class TasksController {
    tasksService;
    constructor(
        $log, $rootScope,
        tasksService
    ) {
        this.tasksService = tasksService;

        this.filters = tasksService.default_params;

        $rootScope.$on('taskFilterChange', (event, filters) => {
            $log.debug('tasks service: filter change', filters);
            this.filters = filters;
        });
    }
}

const Tasks = {
    controller: TasksController,
    template: require('./tasks.html')
};

export default angular.module('mpdx.tasks.component', [])
    .component('tasks', Tasks).name;
