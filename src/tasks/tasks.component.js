class TasksController {
    tasksService;
    constructor(tasksService) {
        this.tasksService = tasksService;
    }
}

const Tasks = {
    controller: TasksController,
    template: require('./tasks.html')
};

export default angular.module('mpdx.tasks.component', [])
    .component('tasks', Tasks).name;
