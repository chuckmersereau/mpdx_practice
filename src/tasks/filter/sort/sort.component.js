class SortController {
    tasks;
    constructor(
        tasks
    ) {
        this.tasks = tasks;
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
