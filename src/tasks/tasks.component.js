class TasksController {
}

const Tasks = {
    controller: TasksController,
    controllerAs: 'vm',
    template: require('./tasks.html'),
    bindings: {}
};

export default angular.module('mpdx.tasks.component', [])
    .component('tasks', Tasks).name;
