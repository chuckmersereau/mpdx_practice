class TasksSearchController {
    tasksService;
    tasksFilter;

    constructor(tasksFilter, tasksService) {
        this.tasksService = tasksService;
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
