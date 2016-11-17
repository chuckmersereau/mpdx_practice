class ConnectController {
    currentAccountListTasks;
    currentUser;
    tasksService;

    constructor(currentUser, currentAccountListTasks, tasksService) {
        this.currentUser = currentUser;
        this.currentAccountListTasks = currentAccountListTasks;
        this.tasksService = tasksService;

        this.overdueCount = null;
        this.overdueTasks = [];
    }
    $onInit() {
        this.currentAccountListTasks.getTasksOverdueCount().then((response) => {
            this.overdueCount = response;
        });
        this.currentAccountListTasks.getTasksOverdueGroupByActivityType().then((response) => {
            this.overdueTasks = _.map(response, (count, task) => {
                return {type: task, count: count};
            });
        });
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