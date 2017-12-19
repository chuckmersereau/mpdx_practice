import get from 'lodash/fp/get';
import concat from 'lodash/fp/concat';
import reject from 'lodash/fp/reject';

class DrawerController {
    constructor(
        $log, $rootScope, $scope,
        api, contacts, tasks, users
    ) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.api = api;
        this.contacts = contacts;
        this.tasks = tasks;
        this.users = users;
    }
    $onChanges(changes) {
        const taskId = get('id', this.task);
        if (taskId !== get('id', changes.previousValue)) {
            this.tasks.load(this.task.id).then((task) => {
                this.task = task;
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
import tasks from 'tasks/tasks.service';

export default angular.module('mpdx.tasks.list.drawer.component', [
    contacts, tasks
]).component('taskItemDrawer', Drawer).name;
