class SortController {
    tasksService;
    constructor(tasksService) {
        this.tasksService = tasksService;
    }
}

const Sort = {
    controller: SortController,
    controllerAs: 'vm',
    template: require('./sort.html'),
    bindings: {}
};

export default angular.module('mpdx.tasks.sort', [])
    .component('tasksSort', Sort).name;
