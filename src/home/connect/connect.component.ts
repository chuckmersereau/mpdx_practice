import 'angular-gettext';
import { defaultTo, filter, find, get, sumBy } from 'lodash/fp';
import serverConstants, { ServerConstantsService } from '../../common/serverConstants/serverConstants.service';
import tasks, { TasksService } from '../../tasks/tasks.service';

class ConnectController {
    limit: number;
    constructor(
        private gettext: ng.gettext.gettextFunction,
        private serverConstants: ServerConstantsService,
        private tasks: TasksService
    ) {
        this.limit = 5;
    }
    totalTasks() {
        return defaultTo(0, sumBy('count', get('analytics.tasks_overdue_or_due_today_counts', this.tasks)));
    }
    totalTypes() {
        return defaultTo(0, filter((c) => c.count > 0, get('analytics.tasks_overdue_or_due_today_counts', this.tasks)).length);
    }
    getTranslatedLabel(label) {
        return label
            ? defaultTo(label, get('value', find({ id: label }, this.serverConstants.data.activity_hashes)))
            : this.gettext('No Action Set');
    }
}

const Connect = {
    template: require('./connect.html'),
    controller: ConnectController
};

export default angular.module('mpdx.home.connect', [
    'gettext',
    serverConstants, tasks
]).component('homeConnect', Connect).name;
