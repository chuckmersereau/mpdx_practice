class ConnectController {
    $state;
    tasksService;

    constructor(
        $state,
        tasksService
    ) {
        this.$state = $state;
        this.tasksService = tasksService;
        this.limit = 5;
    }
    addTask() {
        this.tasksService.openModal({});
    }
    total() {
        if (this.tasksService.analytics && this.tasksService.analytics.tasks_overdue_or_due_today_counts) {
            return _.sumBy(this.tasksService.analytics.tasks_overdue_or_due_today_counts, 'count');
        } else {
            return 0;
        }
    }
}
const Connect = {
    template: require('./connect.html'),
    controller: ConnectController
};

export default angular.module('mpdx.home.connect', [])
    .component('homeConnect', Connect)
    .name;
