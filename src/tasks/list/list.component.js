class ListController {
    tasks;

    constructor(
        tasks
    ) {
        this.tasks = tasks;
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
