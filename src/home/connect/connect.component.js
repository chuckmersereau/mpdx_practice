class ConnectController {
    tasksFilter;
    tasksService;

    constructor(
        $state,
        tasksService, tasksFilter
    ) {
        this.$state = $state;
        this.tasksService = tasksService;
        this.tasksFilter = tasksFilter;
    }
    addTask() {
        this.tasksService.openModal({});
    }
    go(type) {
        this.tasksFilter.params.activity_type = type;
        this.$state.go('tasks');
    }
}
const Connect = {
    template: require('./connect.html'),
    controller: ConnectController
};

export default angular.module('mpdx.home.connect', [])
    .component('homeConnect', Connect)
    .name;