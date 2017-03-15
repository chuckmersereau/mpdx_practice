class TasksSearchController {
    tasks;
    tasksFilter;

    constructor(
        tasksFilter, tasks
    ) {
        this.tasks = tasks;
        this.tasksFilter = tasksFilter;
    }
}
const Search = {
    controller: TasksSearchController,
    template: require('./search.html'),
    bindings: {
        dropdown: '<',
        showFilters: '@',
        searchParams: '<',
        onChange: '&'
    }
};

export default angular.module('mpdx.common.tasks.search', [])
    .component('tasksSearch', Search).name;
