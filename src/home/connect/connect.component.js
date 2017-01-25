class ConnectController {
    tasksService;

    constructor(
        tasksService
    ) {
        this.tasksService = tasksService;
    }
    addTask() {
        this.tasksService.openModal({});
    }
}
const Connect = {
    template: require('./connect.html'),
    controller: ConnectController
};

export default angular.module('mpdx.home.connect', [])
    .component('homeConnect', Connect)
    .name;