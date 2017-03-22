import sumBy from 'lodash/fp/sumBy';

class ConnectController {
    $state;
    tasks;

    constructor(
        $rootScope, tasks, blockUI
    ) {
        this.tasks = tasks;
        this.blockUI = blockUI.instances.get('connect');
        this.watcher = $rootScope.$on('accountListUpdated', () => {
            this.load();
        });
        this.limit = 5;
    }
    $onInit() {
        this.load();
    }
    $onDestroy() {
        this.watcher();
    }
    load() {
        this.blockUI.start();
        this.tasks.getAnalytics(true).then(() => {
            this.blockUI.reset();
        });
    }
    addTask() {
        this.tasks.openModal({});
    }
    totalTasks() {
        if (this.tasks.analytics && this.tasks.analytics.tasks_overdue_or_due_today_counts) {
            return sumBy('count', this.tasks.analytics.tasks_overdue_or_due_today_counts);
        } else {
            return 0;
        }
    }
    totalTypes() {
        if (this.tasks.analytics && this.tasks.analytics.tasks_overdue_or_due_today_counts) {
            const counts = _.filter(this.tasks.analytics.tasks_overdue_or_due_today_counts, function(c) { return c.count > 0; });
            return counts.length;
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
