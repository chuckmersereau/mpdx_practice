class TasksController {
    tasksService;
    constructor(
        $log, $rootScope,
        tasksService
    ) {
        this.tasksService = tasksService;

        this.changed = 0;

        $rootScope.$on('taskFilterChange', () => {
            this.changed++;
        });

        $rootScope.$on('tasksTagsChanged', (event, filters) => {
            $log.debug('tasks component: tag change', filters);
            this.changed++;
        });
    }
}

const Tasks = {
    controller: TasksController,
    template: require('./tasks.html')
};

export default angular.module('mpdx.tasks.component', [])
    .component('tasks', Tasks).name;