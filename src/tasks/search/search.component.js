class TasksSearchController {
    constructor(
        tasks, tasksFilter
    ) {
        this.tasks = tasks;
        this.tasksFilter = tasksFilter;
    }
}
const Search = {
    controller: TasksSearchController,
    template: require('./search.html'),
    bindings: {}
};

export default angular.module('mpdx.common.tasks.search', [])
    .component('tasksSearch', Search).name;
