class ConnectController {
    tasksService;
    users;

    constructor(tasksService, users) {
        this.tasksService = tasksService;
        this.users = users;

        this.overdueCount = null;
        this.overdueTasks = [];
    }
    $onInit() {
        console.error('home/connect: analytics not implemented');
        // this.tasksService.getAnalytics().then((response) => {
        //     this.overdueCount = response;
        // });
        // TODO: connect to above api call //tasks/overdue_and_today/group_by_activity_type
        // this.currentAccountListTasks.getTasksOverdueGroupByActivityType().then((response) => {
        //     this.overdueTasks = _.map(response, (count, task) => {
        //         return {type: task, count: count};
        //     });
        // });
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