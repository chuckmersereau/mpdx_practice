class TasksController {
    tasksFilter;
    constructor(
        $log, $rootScope, $stateParams,
        tasksFilter
    ) {
        this.$stateParams = $stateParams;
        this.tasksFilter = tasksFilter;
    }
    $onInit() {
        // if (this.$stateParams.filters) {
        //     this.tasksFilter.params = this.$stateParams.filters;
        //     this.tasksFilter.change();
        // } else {
        //     this.tasksFilter.reset();
        // }
    }
}

const Tasks = {
    controller: TasksController,
    template: require('./tasks.html')
};

export default angular.module('mpdx.tasks.component', [])
    .component('tasks', Tasks).name;
