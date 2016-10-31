class ConnectController {
    currentAccountList;
    currentUser;
    tasksService;

    constructor(currentUser, currentAccountList, tasksService) {
        this.currentUser = currentUser;
        this.currentAccountList = currentAccountList;
        this.tasksService = tasksService;

        this.overdueCount = null;
        this.overdueTasks = [];
    }
    $onInit() {
        this.currentAccountList.tasks.getTasksOverdueCount().then((response) => {
            this.overdueCount = response;
        });
        this.currentAccountList.tasks.getTasksOverdueGroupByActivityType().then((response) => {
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