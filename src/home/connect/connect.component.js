import sumBy from 'lodash/fp/sumBy';

class ConnectController {
    $state;
    tasks;

    constructor(
        $state,
        tasks
    ) {
        this.$state = $state;
        this.tasks = tasks;
        this.limit = 5;
    }
    addTask() {
        this.tasks.openModal({});
    }
    total() {
        if (this.tasks.analytics && this.tasks.analytics.tasks_overdue_or_due_today_counts) {
            return sumBy('count', this.tasks.analytics.tasks_overdue_or_due_today_counts);
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
