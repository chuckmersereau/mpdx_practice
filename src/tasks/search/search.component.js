class TasksSearchController {
    tasksService;
    tasksFilter;

    constructor(tasksFilter, tasksService) {
        this.tasksService = tasksService;
        this.tasksFilter = tasksFilter;

        this.searchParams = '';
    }
    paramChanged() {
        this.tasksFilter.wildcard_search = this.searchParams;
        this.tasksFilter.change();
    }
}
const Search = {
    controller: TasksSearchController,
    template: require('./search.html'),
    bindings: {
        dropdown: '<',
        showFilters: '@'
    }
};

export default angular.module('mpdx.common.tasks.search', [])
    .component('tasksSearch', Search).name;
