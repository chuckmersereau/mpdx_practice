class TasksSearchController {
    tasksService;
    filterService;

    constructor(tasksFilterService, tasksService) {
        this.tasksService = tasksService;
        this.filterService = tasksFilterService;

        this.searchParams = '';
    }
    paramChanged() {
        this.filterService.params.wildcard_search = this.searchParams;
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
