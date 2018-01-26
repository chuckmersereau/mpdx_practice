import { defaultTo, filter, find, get, sumBy } from 'lodash/fp';

class ConnectController {
    constructor(
        serverConstants, tasks
    ) {
        this.serverConstants = serverConstants;
        this.tasks = tasks;

        this.limit = 5;
    }
    totalTasks() {
        return defaultTo(0, sumBy('count', get('analytics.tasks_overdue_or_due_today_counts', this.tasks)));
    }
    totalTypes() {
        return defaultTo(0, filter((c) => c.count > 0, get('analytics.tasks_overdue_or_due_today_counts', this.tasks)).length);
    }
    getTranslatedLabel(label) {
        return defaultTo(label, get('value', find({ id: label }, this.serverConstants.data.activity_hashes)));
    }
}

const Connect = {
    template: require('./connect.html'),
    controller: ConnectController
};

import serverConstants from 'common/serverConstants/serverConstants.service';
import tasks from 'tasks/tasks.service';

export default angular.module('mpdx.home.connect', [
    serverConstants, tasks
]).component('homeConnect', Connect).name;
