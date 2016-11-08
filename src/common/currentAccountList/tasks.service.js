class Tasks {
    api;

    constructor(api, $log) {
        this.api = api;
        this.$log = $log;
    }
    getTasksOverdueCount() {
        return this.api.get('tasks/overdue_and_today/count');
    }
    getTasksOverdueGroupByActivityType() {
        return this.api.get('tasks/overdue_and_today/group_by_activity_type');
    }
    getFirstCompleteNewsletter() {
        return this.api.get('tasks/newsletters/first_complete');
    }
}

export default angular.module('mpdx.common.currentAccountList.tasks.service', [])
    .service('currentAccountListTasks', Tasks).name;
