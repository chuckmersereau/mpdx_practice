import assign from 'lodash/fp/assign';

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
    }
    $onInit() {
        this.tasksFilter.params = this.$stateParams.filters || {};
        this.tasksFilter.change();
    }
}

const Tasks = {
    controller: TasksController,
    template: require('./tasks.html')
};

export default angular.module('mpdx.tasks.component', [])
    .component('tasks', Tasks).name;
