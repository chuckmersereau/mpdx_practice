import { concat, get, reject } from 'lodash/fp';

class DrawerController {
    constructor(
        $log, $rootScope, $scope,
        alerts, api, contacts, gettext, tasks, users
    ) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.alerts = alerts;
        this.api = api;
        this.contacts = contacts;
        this.gettext = gettext;
        this.tasks = tasks;
        this.users = users;
        this.loaded = false;
    }
    $onChanges(changes) {
        const taskId = get('id', this.task);
        const task = get('task', changes);
        if (taskId !== get('id', task.previousValue)) {
            this.loaded = false;
            return this.tasks.load(this.task.id).then((task) => {
                this.task = task;
                this.loaded = true;
            }).catch(() => {
                const msg = this.gettext('Unable to load requested task');
                this.alerts.addAlert(msg, 'danger');
            });
        }
    }
    addComment() {
        if (this.comment) {
            return this.api.post(`tasks/${this.task.id}/comments`, { body: this.comment, person: { id: this.users.current.id } }).then((data) => {
                data.person = {
                    id: this.users.current.id,
                    first_name: this.users.current.first_name,
                    last_name: this.users.current.last_name
                };
                this.task.comments = concat(this.task.comments, data);
                this.comment = '';
                this.$rootScope.$emit('taskCommentsChanged', this.task);
            });
        }
    }
    commentRemoved(commentId) {
        this.task.comments = reject({ id: commentId }, this.task.comments);
        this.$rootScope.$emit('taskCommentsChanged', this.task);
    }
}

const Drawer = {
    template: require('./drawer.html'),
    controller: DrawerController,
    bindings: {
        view: '<',
        task: '<'
    }
};

import contacts from 'contacts/contacts.service';
import contact from './contact/item.component';
import tasks from 'tasks/tasks.service';

export default angular.module('mpdx.tasks.list.drawer.component', [
    contact, contacts, tasks
]).component('taskItemDrawer', Drawer).name;
