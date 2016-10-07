class ConnectController {
    currentAccountList;
    currentUser;
    constructor(currentUser, currentAccountList) {
        this.currentUser = currentUser;
        this.currentAccountList = currentAccountList;

        this.overdueCount = null;
        this.overdueTasks = [];
    }
    $onInit() {
        this.currentAccountList.tasks.getTasksOverdueCount().then((response) => {
            this.overdueCount = response.data;
        });
        this.currentAccountList.tasks.getTasksOverdueGroupByActivityType().then((response) => {
            this.overdueTasks = _.map(response.data, (count, task) => {
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